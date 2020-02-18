import Config from "webpack-chain";
import merge from "webpack-merge";
import readPkg from "read-pkg";
import fs from "fs";
import path from "path";
import deepmerge from "deepmerge";
import chalk from "chalk";
import { config as dotenvConfig } from "dotenv";
import dotenvExpand from "dotenv-expand";
import { error, warn, loadModule, log } from "@luban-cli/cli-shared-utils";

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
  "./../config/base",
  "./../config/css",
  "./../config/dev",
  "./../config/prod",
];

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
  public commands: CommandList<CliArgs>;
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

  private init(mode: string): void {
    this.mode = mode;

    this.loadEnv(mode);

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

  public run(name: string, args: ParsedArgs = { _: [] }, rawArgv: string[] = []): Promise<void> {
    if (!name) {
      error(`please specify command name`);
      process.exit(1);
    }

    const mode: string = args.mode || (name === "build" ? "production" : "development");

    this.init(mode);

    args._ = args._ || [];
    let command = this.commands[name];
    if (!command && name) {
      error(`command "${name}" does not exist.`);
      process.exit(1);
    }
    if (!command || args.help) {
      command = this.commands.help;
    } else {
      args._.shift();
      rawArgv.shift();
    }
    const { fn } = command;
    return Promise.resolve(fn(args, rawArgv));
  }

  public resolvePlugins(inlinePlugins: InlinePlugin[], useBuiltIn: boolean): ServicePlugin[] {
    const prefixRE = /^@\/luban\/cli-plugin-/;
    const idToPlugin = (id: string): InlinePlugin => ({
      id: id.replace(/^.\//, "built-in:"),
      apply: prefixRE.test(id) ? loadModule(id, this.context) : require(id).default,
    });

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

  public loadEnv(mode?: string): void {
    const basePath = path.resolve(this.context, ".env");
    const baseModePath = path.resolve(this.context, `.env${mode ? `.${mode}` : ``}`);
    const localModePath = `${baseModePath}.local`;

    const load = (path: string): void => {
      const env = dotenvConfig({ path });
      dotenvExpand(env);
      log(`try to load dotenv file ${chalk.green(path)}`);

      if (env.error) {
        warn(`load ${path} file failure, please check it exist`);
      }

      log();
    };

    // this load order is important
    // env.[mode].local has first priority, env.[mode] has second priority and .env has lowest priority
    // if the three files exist
    load(localModePath);
    load(baseModePath);
    load(basePath);

    if (mode) {
      const defaultNodeEnv = mode === "development" ? "development" : "production";

      if (process.env.NODE_ENV === undefined) {
        process.env.NODE_ENV = defaultNodeEnv;
      }

      if (process.env.BABEL_ENV === undefined) {
        process.env.BABEL_ENV = defaultNodeEnv;
      }
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

  public resolveLubanConfig(): Preset {
    // TODO wrong initConfig
    let initConfig: Preset = {
      useConfigFiles: false,
      plugins: { "@luban-cli/cli-plugin-service": {} },
    };
    try {
      const pkg = fs.readFileSync(path.resolve(this.context, "./package.json")).toString();
      initConfig = JSON.parse(pkg)["__luban_config__"];
      return initConfig;
    } catch (error) {
      return initConfig;
    }
  }
}

export { Service };
