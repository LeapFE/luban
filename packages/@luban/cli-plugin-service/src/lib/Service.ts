/* eslint-disable @typescript-eslint/ban-ts-ignore */
import Config = require("webpack-chain");
import merge from "webpack-merge";
import readPkg from "read-pkg";
import fs from "fs-extra";
import path from "path";
import deepmerge from "deepmerge";
import chalk from "chalk";
import { config as dotenvConfig } from "dotenv";
import dotenvExpand from "dotenv-expand";
import { error, warn, loadModule, log, info } from "@luban-cli/cli-shared-utils";
import shell from "shelljs";

import { PluginAPI } from "./PluginAPI";
import { defaultsProjectConfig, validateProjectConfig } from "./options";

import {
  BasePkgFields,
  InlinePlugin,
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
import { ProjectConfig } from "./../main";

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
  cssSolution: "less",
  stylelint: true,
  router: true,
  store: false,
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
    config[key] = config[key].replace(/([^/])$/, "$1/");
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
  private configFilename: string;

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
    this.configFilename = "luban.config.ts";
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
      this.loadProjectOptions(this.inlineProjectOptions),
    );

    this.plugins.forEach(({ id, apply }) => {
      const api = new PluginAPI(id, this);
      apply(api, this.projectConfig);
    });

    if (this.projectConfig.chainWebpack) {
      this.webpackChainCallback.push(this.projectConfig.chainWebpack);
    }

    if (typeof this.projectConfig.configureWebpack === "function") {
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

    if (typeof args.config === "string") {
      this.configFilename = args.config;
    }

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
    } else if (fs.pathExistsSync(path.join(this.context, "package.json"))) {
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

  public loadProjectOptions(inlineOptions?: ProjectConfig): ProjectConfig {
    let fileConfig;
    let resolved;

    const configPath = path.resolve(this.context, this.configFilename);

    if (!fs.pathExistsSync(configPath)) {
      error(`specified config file ${chalk.bold(`${configPath}`)} nonexistent, please check it.`);
      process.exit();
    }

    const configTempDir = path.resolve(this.context, ".config");
    const configTempDirPath = path.resolve(`${configTempDir}/${this.configFilename}`);

    const { code } = shell.exec(
      `${this.context}/node_modules/typescript/bin/tsc ${configPath} --module commonjs --allowJs true --outDir ${configTempDir}`,
    );

    if (code !== 0) {
      // ignore compile error, just print warn
      warn(`compile ${chalk.bold(this.configFilename)} file failure \n`);
    } else {
      info(`compiled ${chalk.green(this.configFilename)} file successfully \n`);
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const configModule = require(`${configTempDirPath.replace("ts", "js")}`);
      fileConfig = configModule.__esModule ? configModule.default : configModule;

      if (!fileConfig || typeof fileConfig !== "object") {
        error(`Error loading ${chalk.bold(`${this.configFilename}`)}: should export an object. \n`);
        fileConfig = null;
      }

      fs.removeSync(configTempDir);
    } catch (e) {}

    if (fileConfig) {
      resolved = fileConfig;
    } else {
      resolved = inlineOptions || {};
    }

    ensureSlash(resolved, "publicPath");
    removeSlash(resolved, "outputDir");

    validateProjectConfig(resolved, (msg) => {
      error(`Invalid options in ${chalk.bold(this.configFilename)}: ${msg}`);
    });

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
