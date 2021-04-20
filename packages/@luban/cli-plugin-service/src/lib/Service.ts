import Config = require("webpack-chain");
import merge from "webpack-merge";
import { error, loadFile } from "@luban-cli/cli-shared-utils";
import globby from "globby";

import { loadAndSetEnv } from "../utils/loadAndSetEnv";
import { loadProjectOptions } from "../utils/loadProjectConfig";
import { loadMockConfig } from "../utils/loadMockConfig";
import { resolveLubanConfig, resolvePkg } from "../utils/pkg";
import { DefaultInstance } from "../utils/defaultInstance";

import { CommandPluginAPI, ConfigPluginAPI } from "./PluginAPI";
import { mergeProjectOptions } from "./options";
import { builtinServiceCommandNameList } from "./constant";

import {
  BasePkgFields,
  CommandList,
  ParsedArgs,
  builtinServiceCommandName,
  RootOptions,
  WebpackConfiguration,
  CommandPlugin,
  ConfigPlugin,
  WebpackConfigList,
  WebpackConfigName,
  ConfigPluginInstance,
  CliArgs,
} from "../definitions";
import { ProjectConfig, MockConfig } from "../main";

class Service {
  public context: string;
  public pkg: BasePkgFields;
  public webpackConfigList: WebpackConfigList;
  public commands: Partial<CommandList>;
  public projectConfig: ProjectConfig;
  public configPlugins: ConfigPlugin[];
  public commandPlugins: CommandPlugin<CliArgs>[];
  public mode: string;
  public mockConfig: MockConfig | undefined;
  private rootOptions: RootOptions;
  private readonly PROJECT_CONFIG_FILE_NAME: string;
  private readonly PROJECT_MOCK_CONFIG_FILE_NAME: string;

  constructor(context: string) {
    this.context = context;

    this.commands = {};

    this.pkg = resolvePkg(this.context);

    this.rootOptions = resolveLubanConfig(this.pkg);

    this.PROJECT_CONFIG_FILE_NAME = "luban.config.ts";

    this.PROJECT_MOCK_CONFIG_FILE_NAME = "mock/index.js";

    this.webpackConfigList = {
      client: {
        config: new Config(),
        chainCallback: [],
        rawCallback: [],
      },
      server: {
        config: new Config(),
        chainCallback: [],
        rawCallback: [],
      },
    };

    this.mockConfig = undefined;
  }

  private async init(
    mode: string,
    commandName: builtinServiceCommandName,
    args: ParsedArgs,
    rawArgv: string[],
  ): Promise<void> {
    this.mode = mode;

    loadAndSetEnv(this.mode, this.context, commandName);

    this.configPlugins = await this.resolveConfigPlugins();

    this.commandPlugins = await this.resolveCommandPlugins();

    const loadedProjectConfig = loadProjectOptions(this.context, this.PROJECT_CONFIG_FILE_NAME);

    this.projectConfig = mergeProjectOptions(loadedProjectConfig, this.rootOptions);

    this.mockConfig = loadMockConfig(
      this.context,
      this.PROJECT_MOCK_CONFIG_FILE_NAME,
      this.projectConfig.mock,
    );

    const commonParams = {
      projectConfig: this.projectConfig,
      options: this.rootOptions,
      mode: this.mode,
      commandName,
      args,
      rawArgv,
    };

    this.configPlugins.forEach(({ id, instance }) => {
      const api = new ConfigPluginAPI(id, this);
      instance.apply({
        api,
        ...commonParams,
      });
    });

    this.commandPlugins.forEach(({ id, instance }) => {
      const _api = new CommandPluginAPI(id, this);
      instance.apply({
        api: _api,
        ...commonParams,
      });
    });
  }

  public async run(
    name?: builtinServiceCommandName,
    args: ParsedArgs = { _: [] },
    rawArgv: string[] = [],
  ): Promise<void> {
    if (!name) {
      error(`please specify command name`);
      process.exit(1);
    }

    const mode: string = args.mode || (name === "build" ? "production" : "development");

    await this.init(mode, name, args, rawArgv);

    // after init, all command registered
    args._ = args._ || [];
    let command = (this.commands as CommandList)[name];
    if (!builtinServiceCommandNameList.has(name) || args.help) {
      command = (this.commands as CommandList).help;
    } else {
      args._.shift();
      rawArgv.shift();
    }

    const { commandCallback } = command;
    return Promise.resolve(commandCallback());
  }

  private async resolveCommandPlugins(): Promise<CommandPlugin<CliArgs>[]> {
    const builtInCommandPluginsPath = await globby("../commands/*.js", {
      cwd: __dirname,
    });

    const idToPlugin = (id: string): CommandPlugin<CliArgs> => {
      const Instance = require(id).default;

      return {
        id: id.replace(/^.\//, "built-in:"),
        instance: new Instance(),
      };
    };

    return builtInCommandPluginsPath.map(idToPlugin);
  }

  private async resolveConfigPlugins(): Promise<ConfigPlugin[]> {
    const loadPluginServiceWithWarn = (id: string): ConfigPluginInstance => {
      let serviceApply = undefined;
      try {
        serviceApply = loadFile<ConfigPluginInstance>(`${id}/dist/index.js`);
      } catch (e) {
        // `service of plugin [${id}] not found while resolving plugin, use default service function instead`,
      }

      return serviceApply || DefaultInstance;
    };

    const prefixRE = /^@luban-cli\/cli-plugin-/;
    const idToPlugin = (id: string): ConfigPlugin => {
      const Instance = prefixRE.test(id)
        ? loadPluginServiceWithWarn(id)
        : require(id).default || DefaultInstance;

      return {
        id: id.replace(/^.\//, "built-in:"),
        instance: new Instance(),
      };
    };

    const builtInConfigPluginsPath = await globby("../config/*.js", {
      cwd: __dirname,
    });

    const builtInConfigPlugins = builtInConfigPluginsPath.map(idToPlugin);

    const pluginList = this.pkg.__luban_config__ ? this.pkg.__luban_config__.plugins : {};
    const projectPlugins = Object.keys(pluginList)
      .filter((p) => prefixRE.test(p))
      .map(idToPlugin);

    return builtInConfigPlugins.concat(projectPlugins);
  }

  public resolveChainableWebpackConfig(name: WebpackConfigName): Config {
    this.webpackConfigList[name].chainCallback.forEach((fn) =>
      fn(this.webpackConfigList[name].config),
    );

    return this.webpackConfigList[name].config;
  }

  public resolveWebpackConfig(
    name: WebpackConfigName,
    chainableConfig = this.resolveChainableWebpackConfig(name),
  ): WebpackConfiguration {
    let config = chainableConfig.toConfig();

    this.webpackConfigList[name].rawCallback.forEach((fn) => {
      if (typeof fn === "function") {
        const result = fn(config);
        if (result) {
          config = merge(config, result);
        }
      } else if (fn) {
        config = merge(config, fn);
      }
    });

    return config;
  }
}

export { Service };
