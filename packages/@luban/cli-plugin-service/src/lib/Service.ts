import Config = require("webpack-chain");
import merge from "webpack-merge";
import { error, warn, loadFile } from "@luban-cli/cli-shared-utils";
import globby from "globby";

import { loadAndSetEnv } from "../utils/loadAndSetEnv";
import { loadProjectOptions } from "../utils/loadProjectConfig";
import { loadMockConfig } from "../utils/loadMockConfig";
import { resolveLubanConfig, resolvePkg } from "../utils/pkg";

import { CommandPluginAPI, ConfigPluginAPI } from "./PluginAPI";
import { mergeProjectOptions } from "./options";
import {
  builtInConfigPluginsRelativePath,
  builtinServiceCommandNameList,
  builtInCommandPluginsRelativePath,
} from "./constant";

import {
  BasePkgFields,
  WebpackChainCallback,
  WebpackRawConfigCallback,
  CommandList,
  ParsedArgs,
  CliArgs,
  builtinServiceCommandName,
  RootOptions,
  WebpackConfiguration,
  CommandPlugin,
  ConfigPlugin,
  ConfigPluginApplyCallback,
} from "../definitions";
import { ProjectConfig, MockConfig } from "../main";

class Service {
  public context: string;
  public pkg: BasePkgFields;
  public webpackConfig: Config;
  public webpackChainCallback: WebpackChainCallback[];
  public webpackRawConfigCallback: WebpackRawConfigCallback[];
  public commands: Partial<CommandList<CliArgs>>;
  public projectConfig: ProjectConfig;
  public configPlugins: ConfigPlugin[];
  public commandPlugins: CommandPlugin[];
  public mode: string;
  public mockConfig: MockConfig | undefined;
  private rootOptions: RootOptions;
  private readonly PROJECT_CONFIG_FILE_NAME: string;
  private readonly PROJECT_MOCK_CONFIG_FILE_NAME: string;

  constructor(context: string) {
    this.context = context;

    this.pkg = resolvePkg(this.context);
    this.rootOptions = resolveLubanConfig(this.pkg);

    this.PROJECT_CONFIG_FILE_NAME = "luban.config.ts";

    this.PROJECT_MOCK_CONFIG_FILE_NAME = "mock/index.js";

    this.webpackConfig = new Config();
    this.webpackChainCallback = [];
    this.webpackRawConfigCallback = [];
    this.commands = {};

    this.mockConfig = undefined;
  }

  private async init(mode: string, commandName: builtinServiceCommandName): Promise<void> {
    this.configPlugins = await this.resolveConfigPlugins();

    this.commandPlugins = await this.resolveCommandPlugins();

    this.mode = mode;

    loadAndSetEnv(this.mode, this.context, commandName);

    const loadedProjectConfig = loadProjectOptions(this.context, this.PROJECT_CONFIG_FILE_NAME);

    this.projectConfig = mergeProjectOptions(loadedProjectConfig, this.rootOptions);

    this.mockConfig = loadMockConfig(
      this.context,
      this.PROJECT_MOCK_CONFIG_FILE_NAME,
      this.projectConfig.mock,
    );

    this.configPlugins.forEach(({ id, instance }) => {
      const api = new ConfigPluginAPI(id, this);
      instance.apply({
        api,
        projectConfig: this.projectConfig,
        options: this.rootOptions,
        mode: this.mode,
        commandName,
      });
    });

    if (this.projectConfig.chainWebpack) {
      this.webpackChainCallback.push(this.projectConfig.chainWebpack);
    }

    if (this.projectConfig.configureWebpack) {
      this.webpackRawConfigCallback.push(this.projectConfig.configureWebpack);
    }

    this.commandPlugins.forEach(({ id, instance }) => {
      const _api = new CommandPluginAPI(id, this);
      instance.apply({
        api: _api,
        projectConfig: this.projectConfig,
        options: this.rootOptions,
        mode: this.mode,
        commandName,
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

    await this.init(mode, name);

    // after init, all command registered
    args._ = args._ || [];
    let command = (this.commands as CommandList<CliArgs>)[name];
    if (!builtinServiceCommandNameList.has(name) || args.help) {
      command = (this.commands as CommandList<CliArgs>).help;
    } else {
      args._.shift();
      rawArgv.shift();
    }

    const { commandCallback } = command;
    return Promise.resolve(commandCallback(args, rawArgv));
  }

  private async resolveCommandPlugins(): Promise<CommandPlugin[]> {
    const builtInCommandPluginsPath = await globby([builtInCommandPluginsRelativePath], {
      cwd: this.context,
    });

    const idToPlugin = (id: string): CommandPlugin => {
      const Instance = require(id).default || (() => undefined);

      return {
        id: id.replace(/^.\//, "built-in:"),
        instance: new Instance(),
      };
    };

    return builtInCommandPluginsPath.map(idToPlugin);
  }

  private async resolveConfigPlugins(): Promise<ConfigPlugin[]> {
    const loadPluginServiceWithWarn = (id: string): ConfigPluginApplyCallback => {
      let serviceApply = loadFile<ConfigPluginApplyCallback>(`${id}/dist/index.js`);

      if (typeof serviceApply !== "function") {
        warn(
          `service of plugin [${id}] not found while resolving plugin, use default service function instead`,
        );
        serviceApply = (): void => undefined;
      }

      return serviceApply;
    };

    const prefixRE = /^@luban-cli\/cli-plugin-/;
    const idToPlugin = (id: string): ConfigPlugin => {
      const Instance = require(id).default || (() => undefined);

      return {
        id: id.replace(/^.\//, "built-in:"),
        instance: prefixRE.test(id) ? loadPluginServiceWithWarn(id) : new Instance(),
      };
    };

    const builtInPluginsPath = await globby([builtInConfigPluginsRelativePath]);

    const builtInPlugins = builtInPluginsPath.map(idToPlugin);

    const pluginList = this.pkg.__luban_config__ ? this.pkg.__luban_config__.plugins : {};
    const projectPlugins = Object.keys(pluginList)
      .filter((p) => prefixRE.test(p))
      .map(idToPlugin);

    return builtInPlugins.concat(projectPlugins);
  }

  public resolveChainableWebpackConfig(): Config {
    const chainableConfig = new Config();
    this.webpackChainCallback.forEach((fn) => fn(chainableConfig));
    return chainableConfig;
  }

  public resolveWebpackConfig(
    chainableConfig = this.resolveChainableWebpackConfig(),
  ): WebpackConfiguration {
    let config = chainableConfig.toConfig();

    this.webpackRawConfigCallback.forEach((fn) => {
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
