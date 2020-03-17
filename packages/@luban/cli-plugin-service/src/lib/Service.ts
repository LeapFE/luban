import Config from "webpack-chain";
import merge from "webpack-merge";
import readPkg from "read-pkg";
import fs from "fs";
import path from "path";
import deepmerge from "deepmerge";
import chalk from "chalk";
import { config as dotenvConfig } from "dotenv";
import dotenvExpand from "dotenv-expand";
import { error, warn, loadModule, log, info } from "@luban-cli/cli-shared-utils";

import { PluginAPI } from "./PluginAPI";
import { defaultsProjectConfig, validateProjectConfig } from "./options";

import {
  BasePkgFields,
  InlinePlugin,
  ProjectConfig,
  WebpackChainCallback,
  WebpackDevServerConfigCallback,
  WebpackRawConfigCallback,
  CommandList,
  ServicePlugin,
  Preset,
  ParsedArgs,
  CliArgs,
  WebpackConfiguration,
  PluginApplyCallback,
  builtinServiceCommandName,
} from "./../definitions";

type ResetParams = Partial<{
  plugins: InlinePlugin[];
  pkg: BasePkgFields;
  projectOptions: ProjectConfig;
  useBuiltIn: boolean;
}>;

const defaultPackageFields: BasePkgFields = {
  name: "",
  version: "",
};

const builtInPluginsRelativePath = [
  "./../commands/serve",
  "./../commands/build",
  "./../commands/inspect",
  "./../commands/help",
  "./../config/base",
  "./../config/css",
  "./../config/dev",
  "./../config/prod",
];

const builtinServiceCommandNameList = new Set<builtinServiceCommandName>([
  "build",
  "inspect",
  "serve",
  "help",
]);

const defaultPreset: Required<Preset> = {
  language: "ts",
  eslint: "standard",
  cssPreprocessor: "less",
  stylelint: true,
  router: true,
  store: true,
  unitTest: true,
  fetch: true,
  plugins: {
    "@luban-cli/cli-plugin-service": {},
    "@luban-cli/cli-plugin-babel": {},
    "@luban-cli/cli-plugin-eslint": {},
    "@luban-cli/cli-plugin-router": {},
    "@luban-cli/cli-plugin-store": {},
    "@luban-cli/cli-plugin-stylelint": {},
    "@luban-cli/cli-plugin-typescript": {},
    "@luban-cli/cli-plugin-unit-test": {},
  },
};

function ensureSlash(config: Record<string, any>, key: string): void {
  if (typeof config[key] === "string") {
    config[key] = config[key].replace(/^([^/])/, "/$1").replace(/([^/])$/, "$1/");
  }
}

function removeSlash(config: Record<string, any>, key: string): void {
  if (typeof config[key] === "string") {
    config[key] = config[key].replace(/^\/|\/$/g, "");
  }
}

class Service {
  public context: string;
  public pkg: BasePkgFields;
  public webpackConfig: Config;
  public webpackChainCallback: WebpackChainCallback[];
  public webpackRawConfigCallback: WebpackRawConfigCallback[];
  public webpackDevServerConfigCallback: WebpackDevServerConfigCallback[];
  public commands: Partial<CommandList<CliArgs>>;
  public projectConfig: ProjectConfig;
  public plugins: ServicePlugin[];
  public mode: string;
  private inlineProjectOptions?: ProjectConfig;

  constructor(context: string, { plugins, pkg, projectOptions, useBuiltIn }: ResetParams) {
    Object.defineProperties(process, {
      LUBAN_CLI_SERVICE: {
        value: this,
        writable: false,
        enumerable: false,
        configurable: false,
      },
    });

    this.context = context;
    this.webpackConfig = new Config();
    this.webpackChainCallback = [];
    this.webpackDevServerConfigCallback = [];
    this.webpackRawConfigCallback = [];
    this.commands = {};
    this.pkg = this.resolvePkg(pkg);

    this.inlineProjectOptions = projectOptions;

    this.plugins = this.resolvePlugins(plugins || [], useBuiltIn || false);
  }

  private init(mode: string, commandName: builtinServiceCommandName): void {
    this.mode = mode;

    this.loadAndSetEnv(mode, commandName);

    this.projectConfig = deepmerge(
      defaultsProjectConfig,
      this.loadProjectOptions(this.inlineProjectOptions || defaultsProjectConfig),
    );

    this.plugins.forEach(({ id, apply }) => {
      const api = new PluginAPI(id, this);
      apply(api, this.projectConfig);
    });

    if (this.projectConfig.chainWebpack) {
      this.webpackChainCallback.push(this.projectConfig.chainWebpack);
    }

    if (this.projectConfig.configureWebpack) {
      this.webpackRawConfigCallback.push(this.projectConfig.configureWebpack);
    }
  }

  public run(
    name?: builtinServiceCommandName,
    args: ParsedArgs = { _: [] },
    rawArgv: string[] = [],
  ): Promise<void> {
    if (!name) {
      error(`please specify command name`);
      process.exit(1);
    }

    const mode: string = args.mode || (name === "build" ? "production" : "development");

    this.init(mode, name);

    // after init, all command registered
    args._ = args._ || [];
    let command = (this.commands as CommandList<CliArgs>)[name];
    if (!builtinServiceCommandNameList.has(name) || args.help) {
      command = (this.commands as CommandList<CliArgs>).help;
    } else {
      args._.shift(); // remove command itself
      rawArgv.shift();
    }

    const { commandCallback } = command;
    return Promise.resolve(commandCallback(args, rawArgv));
  }

  public resolvePlugins(inlinePlugins: InlinePlugin[], useBuiltIn: boolean): ServicePlugin[] {
    const loadPluginServiceWithWarn = (id: string, context: string): PluginApplyCallback => {
      let serviceApply = loadModule(`${id}/dist/index.js`, context);

      if (typeof serviceApply !== "function") {
        warn(
          `service of plugin [${id}] not found while resolving plugin, use default service function instead`,
        );
        serviceApply = (): void => undefined;
      }

      return serviceApply;
    };

    const prefixRE = /^@luban-cli\/cli-plugin-/;
    const idToPlugin = (id: string): InlinePlugin => {
      return {
        id: id.replace(/^.\//, "built-in:"),
        apply: prefixRE.test(id)
          ? loadPluginServiceWithWarn(id, this.context)
          : require(id).default,
      };
    };

    const builtInPlugins = builtInPluginsRelativePath.map(idToPlugin);

    if (inlinePlugins.length !== 0) {
      return useBuiltIn !== false ? builtInPlugins.concat(inlinePlugins) : inlinePlugins;
    } else {
      const pluginList = this.pkg.__luban_config__ ? this.pkg.__luban_config__.plugins : {};
      const projectPlugins = Object.keys(pluginList)
        .filter((p) => prefixRE.test(p))
        .map(idToPlugin);

      return builtInPlugins.concat(projectPlugins);
    }
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
        config = fn(config) || config;
      } else if (fn) {
        config = merge(config, fn);
      }
    });
    return config;
  }

  public resolvePkg(inlinePkg?: BasePkgFields): BasePkgFields {
    if (inlinePkg) {
      return inlinePkg;
    } else if (fs.existsSync(path.join(this.context, "package.json"))) {
      return readPkg.sync({ cwd: this.context }) as BasePkgFields;
    } else {
      return defaultPackageFields;
    }
  }

  public loadAndSetEnv(mode: string, commandName: builtinServiceCommandName): void {
    const basePath = path.resolve(this.context, ".env");
    const baseModePath = path.resolve(this.context, `.env.${mode}`);
    const localModePath = `${baseModePath}.local`;

    const load = (path: string): void => {
      const env = dotenvConfig({ path });
      dotenvExpand(env);

      if (!env.error) {
        info(`loaded dotenv file ${chalk.green(path)} successfully`);
      }

      log();
    };

    // this load order is important
    // env.[mode].local has first priority, env.[mode] has second priority and .env has lowest priority
    // if the three files exist
    load(localModePath);
    load(baseModePath);
    load(basePath);

    const writeEnv = (key: string, value: any): void => {
      Object.defineProperty(process.env, key, {
        value: value,
        writable: false,
        configurable: false,
        enumerable: true,
      });
    };

    if (commandName === "serve" || commandName === "inspect") {
      writeEnv("NODE_ENV", "development");
      writeEnv("BABEL_ENV", "development");
    }

    if (commandName === "build") {
      writeEnv("NODE_ENV", "production");
      writeEnv("BABEL_ENV", "production");
    }
  }

  public loadProjectOptions(inlineOptions: ProjectConfig): ProjectConfig {
    let fileConfig, pkgConfig, resolved;

    const configPath = path.resolve(this.context, "luban.config.js");
    try {
      fileConfig = require(configPath);
      if (!fileConfig || typeof fileConfig !== "object") {
        error(`Error loading ${chalk.bold("luban.config.js")}: should export an object.`);
        fileConfig = null;
      }
    } catch (e) {}

    // [package.json].luban
    pkgConfig = this.pkg.luban;
    if (pkgConfig && typeof pkgConfig !== "object") {
      error(
        `Error loading luban-cli config in ${chalk.bold(`package.json`)}: ` +
          `the "luban" field should be an object.`,
      );
      pkgConfig = null;
    }

    if (fileConfig) {
      if (pkgConfig) {
        warn(
          `"luban" field in ${chalk.bold(`package.json`)} ignored ` +
            `due to presence of ${chalk.bold("luban.config.js")}.`,
        );
      }
      resolved = fileConfig;
    } else if (pkgConfig) {
      resolved = pkgConfig;
    } else {
      resolved = inlineOptions || {};
    }

    ensureSlash(resolved, "base");
    removeSlash(resolved, "outputDir");

    validateProjectConfig(resolved);

    return resolved;
  }

  public resolveLubanConfig(): Required<Preset> {
    let initConfig: Required<Preset> = defaultPreset;

    const pkg = this.resolvePkg();
    if (pkg.__luban_config__) {
      initConfig = pkg.__luban_config__;
    }

    return initConfig;
  }
}

export { Service };
