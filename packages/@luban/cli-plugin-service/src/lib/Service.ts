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
  WebpackConfigQueue,
  WebpackConfigName,
  ConfigPluginInstance,
  CliArgs,
} from "../definitions";
import { ProjectConfig, MockConfig } from "../main";
import { produce } from "./produce";

class Service {
  private readonly _context: string;
  public readonly pkg: BasePkgFields;
  public readonly webpackConfigQueue: WebpackConfigQueue;
  public readonly _commands: Partial<CommandList>;
  private projectConfig: ProjectConfig;
  public configPlugins: ConfigPlugin[];
  public commandPlugins: CommandPlugin<CliArgs>[];
  public mode: string;
  public mockConfig: MockConfig | undefined;
  private readonly rootOptions: RootOptions;
  private readonly PROJECT_CONFIG_FILE_NAME: string;
  private readonly PROJECT_MOCK_CONFIG_FILE_NAME: string;

  constructor(context: string) {
    this._context = context;

    this._commands = {};

    this.pkg = resolvePkg(this.context);

    this.rootOptions = resolveLubanConfig(this.pkg);

    this.PROJECT_CONFIG_FILE_NAME = "luban.config.ts";

    this.PROJECT_MOCK_CONFIG_FILE_NAME = "mock/index.js";

    this.webpackConfigQueue = new Map();

    this.webpackConfigQueue.set("public", {
      id: "public",
      config: new Config(),
      chainCallback: [],
      rawCallback: [],
    });

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

    this.commandPlugins = await this.resolveCommandPlugins();

    this.configPlugins = await this.resolveConfigPlugins();

    const loadedProjectConfig = loadProjectOptions(this.context, this.PROJECT_CONFIG_FILE_NAME);

    this.projectConfig = mergeProjectOptions(loadedProjectConfig, this.rootOptions);

    this.commandPlugins.forEach(({ id, instance }) => {
      if (typeof instance.addWebpackConfig === "function") {
        const _api = new CommandPluginAPI(id, this);
        instance.addWebpackConfig({ api: _api, projectConfig: this.projectConfig });
      }
    });

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

    if (name === "serve" || name === "build") {
      await produce();
    }

    await this.init(mode, name, args, rawArgv);

    // after init, all command registered
    args._ = args._ || [];
    let command = (this._commands as CommandList)[name];
    if (!builtinServiceCommandNameList.has(name) || args.help) {
      command = (this._commands as CommandList).help;
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

  public resolveChainableWebpackConfig(name: WebpackConfigName): Config | undefined {
    const configQueue = this.webpackConfigQueue.get(name);

    configQueue?.chainCallback.forEach((fn) => {
      if (configQueue?.id === "public") {
        return;
      }

      fn(configQueue.config, configQueue.id);
    });

    return configQueue?.config;
  }

  public resolveWebpackConfig(
    name: WebpackConfigName,
    chainableConfig = this.resolveChainableWebpackConfig(name),
  ): WebpackConfiguration | undefined {
    if (chainableConfig) {
      let config = chainableConfig.toConfig();

      const configQueue = this.webpackConfigQueue.get(name);

      configQueue?.rawCallback.forEach((fn) => {
        if (configQueue?.id === "public") {
          return;
        }

        if (typeof fn === "function") {
          const result = fn(config, configQueue.id);
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

  public addWebpackConfigQueueItem(name: WebpackConfigName) {
    this.webpackConfigQueue.set(name, {
      id: name,
      config: new Config(),
      chainCallback: [],
      rawCallback: [],
    });
  }

  get context() {
    return this._context;
  }

  get commands() {
    return this._commands;
  }
}

export { Service };
