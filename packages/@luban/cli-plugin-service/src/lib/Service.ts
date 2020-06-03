import Config = require("webpack-chain");
import merge from "webpack-merge";
import readPkg from "read-pkg";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { config as dotenvConfig } from "dotenv";
import dotenvExpand from "dotenv-expand";
import { error, warn, loadModule, log, info, Spinner } from "@luban-cli/cli-shared-utils";
import shell from "shelljs";
import webpack = require("webpack");

import { PluginAPI } from "./PluginAPI";
import { validateProjectConfig, mergeProjectOptions } from "./options";

import {
  BasePkgFields,
  InlinePlugin,
  WebpackChainCallback,
  WebpackRawConfigCallback,
  CommandList,
  ServicePlugin,
  ParsedArgs,
  CliArgs,
  PluginApplyCallback,
  builtinServiceCommandName,
  RootOptions,
} from "./../definitions";
import { ProjectConfig, MockConfig } from "./../main";

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

const defaultRootOptions: Required<RootOptions> = {
  projectName: "",
  language: "ts",
  eslint: "standard",
  cssSolution: "less",
  stylelint: true,
  router: true,
  store: false,
  unitTest: true,
  fetch: true,
  plugins: {
    "@luban-cli/cli-plugin-service": {
      projectName: "",
    },
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
  public commands: Partial<CommandList<CliArgs>>;
  public projectConfig: ProjectConfig;
  public plugins: ServicePlugin[];
  public mode: string;
  private inlineProjectOptions?: ProjectConfig;
  private configFilename: string;
  public mockConfig: MockConfig | null;
  private rootOptions: RootOptions;
  private mockConfigFile: string;

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

    this.rootOptions = this.resolveLubanConfig();

    this.configFilename =
      this.rootOptions.language === "js" ? "luban.config.js" : "luban.config.ts";

    this.mockConfigFile = "mock/index.js";

    this.webpackConfig = new Config();
    this.webpackChainCallback = [];
    this.webpackRawConfigCallback = [];
    this.commands = {};
    this.pkg = this.resolvePkg(pkg);

    this.inlineProjectOptions = projectOptions;

    this.mockConfig = null;

    this.plugins = this.resolvePlugins(plugins || [], useBuiltIn || false);
  }

  private init(mode: string, commandName: builtinServiceCommandName): void {
    this.mode = mode;

    this.loadAndSetEnv(mode, commandName);

    const loadedProjectConfig = this.loadProjectOptions(this.inlineProjectOptions);

    this.projectConfig = mergeProjectOptions(loadedProjectConfig, this.rootOptions);

    this.mockConfig = this.loadMockConfig();

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
  ): webpack.Configuration {
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

  private requireSpecifiedConfigFile(filePath: string, configFilename: string): any {
    if (/\w+\.js$/.test(configFilename)) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const configModule = require(filePath);

      return configModule.__esModule ? configModule.default : configModule;
    }

    const spinner = new Spinner();
    spinner.logWithSpinner(`compiling ${chalk.green(configFilename)} ... \n`);

    const configTempDir = path.resolve(this.context, ".config");
    const configTempDirPath = path.resolve(`${configTempDir}/${configFilename}`);

    const tscBinPath = `${this.context}/node_modules/typescript/bin/tsc`;
    const compileArgs = `--module commonjs --skipLibCheck --outDir ${configTempDir}`;
    const { code } = shell.exec(`${tscBinPath} ${filePath} ${compileArgs}`);

    if (code !== 0) {
      // ignore compile error, just print warn
      warn(`compiled ${chalk.bold(configFilename)} file failure \n`);
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const configModule = require(`${configTempDirPath.replace("ts", "js")}`);

    fs.removeSync(configTempDir);

    spinner.stopSpinner();

    return configModule.__esModule ? configModule.default : configModule;
  }

  public loadProjectOptions(inlineOptions?: ProjectConfig): Partial<ProjectConfig> {
    let fileConfig: Partial<ProjectConfig> | null = null;
    let resolved: Partial<ProjectConfig> = {};

    const configPath = path.resolve(this.context, this.configFilename);

    if (!fs.pathExistsSync(configPath)) {
      error(`specified config file ${chalk.bold(`${configPath}`)} nonexistent, please check it.`);
      process.exit();
    }

    try {
      fileConfig = this.requireSpecifiedConfigFile(configPath, this.configFilename);

      if (!fileConfig || typeof fileConfig !== "object") {
        error(`Error load ${chalk.bold(`${this.configFilename}`)}: should export an object. \n`);
        fileConfig = null;
      }
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

  private loadMockConfig(): MockConfig | null {
    let _mockConfig: MockConfig | null = null;

    const mockConfigFilePath = path.resolve(this.context, this.mockConfigFile);

    if (!fs.pathExistsSync(mockConfigFilePath)) {
      error(
        `specified mock config file ${chalk.bold(
          `${mockConfigFilePath}`,
        )} nonexistent, please check it.`,
      );
      process.exit();
    }

    try {
      _mockConfig = require(mockConfigFilePath);

      if (!_mockConfig || typeof _mockConfig !== "object") {
        error(`Error load ${chalk.bold(`${this.mockConfigFile}`)}: should export an object. \n`);
        _mockConfig = null;
      }
    } catch (e) {}

    return _mockConfig;
  }

  public resolveLubanConfig(): Required<RootOptions> {
    let initConfig: Required<RootOptions> = defaultRootOptions;

    const pkg = this.resolvePkg();
    if (pkg.__luban_config__) {
      initConfig = pkg.__luban_config__;
    }

    return initConfig;
  }
}

export { Service };
