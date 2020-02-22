"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_chain_1 = __importDefault(require("webpack-chain"));
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const read_pkg_1 = __importDefault(require("read-pkg"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const deepmerge_1 = __importDefault(require("deepmerge"));
const chalk_1 = __importDefault(require("chalk"));
const dotenv_1 = require("dotenv");
const dotenv_expand_1 = __importDefault(require("dotenv-expand"));
const cli_shared_utils_1 = require("@luban-cli/cli-shared-utils");
const PluginAPI_1 = require("./PluginAPI");
const options_1 = require("./options");
const defaultPackageFields = {
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
const defaultPreset = {
    language: "ts",
    eslint: "standard",
    cssPreprocessor: "less",
    stylelint: true,
    router: true,
    store: true,
    unitTest: true,
    uiLibrary: [],
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
function ensureSlash(config, key) {
    if (typeof config[key] === "string") {
        config[key] = config[key].replace(/^([^/])/, "/$1").replace(/([^/])$/, "$1/");
    }
}
function removeSlash(config, key) {
    if (typeof config[key] === "string") {
        config[key] = config[key].replace(/^\/|\/$/g, "");
    }
}
class Service {
    constructor(context, { plugins, pkg, projectOptions, useBuiltIn }) {
        Object.defineProperties(process, {
            LUBAN_CLI_SERVICE: {
                value: this,
                writable: false,
                enumerable: false,
                configurable: false,
            },
        });
        this.context = context;
        this.webpackConfig = new webpack_chain_1.default();
        this.webpackChainCallback = [];
        this.webpackDevServerConfigCallback = [];
        this.webpackRawConfigCallback = [];
        this.commands = {};
        this.pkg = this.resolvePkg(pkg);
        this.inlineProjectOptions = projectOptions;
        this.plugins = this.resolvePlugins(plugins || [], useBuiltIn || false);
    }
    init(mode) {
        this.mode = mode;
        this.loadEnv(mode);
        this.projectConfig = deepmerge_1.default(options_1.defaultsProjectConfig, this.loadProjectOptions(this.inlineProjectOptions || options_1.defaultsProjectConfig));
        this.plugins.forEach(({ id, apply }) => {
            const api = new PluginAPI_1.PluginAPI(id, this);
            apply(api, this.projectConfig);
        });
        if (this.projectConfig.chainWebpack) {
            this.webpackChainCallback.push(this.projectConfig.chainWebpack);
        }
        if (this.projectConfig.configureWebpack) {
            this.webpackRawConfigCallback.push(this.projectConfig.configureWebpack);
        }
    }
    run(name, args = { _: [] }, rawArgv = []) {
        if (!name) {
            cli_shared_utils_1.error(`please specify command name`);
            process.exit(1);
        }
        const mode = args.mode || (name === "build" ? "production" : "development");
        this.init(mode);
        args._ = args._ || [];
        let command = this.commands[name];
        if (!command && name) {
            cli_shared_utils_1.error(`command "${name}" does not exist.`);
            process.exit(1);
        }
        if (!command || args.help) {
            command = this.commands.help;
        }
        else {
            args._.shift();
            rawArgv.shift();
        }
        const { fn } = command;
        return Promise.resolve(fn(args, rawArgv));
    }
    resolvePlugins(inlinePlugins, useBuiltIn) {
        const loadPluginServiceWithWarn = (id, context) => {
            let serviceApply = cli_shared_utils_1.loadModule(`${id}/dist/index.js`, context);
            if (typeof serviceApply !== "function") {
                cli_shared_utils_1.warn(`service of plugin [${id}] not found while resolving plugin, use default service function instead`);
                serviceApply = () => undefined;
            }
            return serviceApply;
        };
        const prefixRE = /^@luban-cli\/cli-plugin-/;
        const idToPlugin = (id) => {
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
        }
        else {
            const pluginList = this.pkg.__luban_config__ ? this.pkg.__luban_config__.plugins : {};
            const projectPlugins = Object.keys(pluginList)
                .filter((p) => prefixRE.test(p))
                .map(idToPlugin);
            return builtInPlugins.concat(projectPlugins);
        }
    }
    resolveChainableWebpackConfig() {
        const chainableConfig = new webpack_chain_1.default();
        this.webpackChainCallback.forEach((fn) => fn(chainableConfig));
        return chainableConfig;
    }
    resolveWebpackConfig(chainableConfig = this.resolveChainableWebpackConfig()) {
        let config = chainableConfig.toConfig();
        this.webpackRawConfigCallback.forEach((fn) => {
            if (typeof fn === "function") {
                config = fn(config) || config;
            }
            else if (fn) {
                config = webpack_merge_1.default(config, fn);
            }
        });
        return config;
    }
    resolvePkg(inlinePkg) {
        if (inlinePkg) {
            return inlinePkg;
        }
        else if (fs_1.default.existsSync(path_1.default.join(this.context, "package.json"))) {
            return read_pkg_1.default.sync({ cwd: this.context });
        }
        else {
            return defaultPackageFields;
        }
    }
    loadEnv(mode) {
        const basePath = path_1.default.resolve(this.context, ".env");
        const baseModePath = path_1.default.resolve(this.context, `.env${mode ? `.${mode}` : ``}`);
        const localModePath = `${baseModePath}.local`;
        const load = (path) => {
            const env = dotenv_1.config({ path });
            dotenv_expand_1.default(env);
            if (!env.error) {
                cli_shared_utils_1.info(`loaded dotenv file ${chalk_1.default.green(path)} successfully`);
            }
            cli_shared_utils_1.log();
        };
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
    loadProjectOptions(inlineOptions) {
        let fileConfig, pkgConfig, resolved;
        const configPath = path_1.default.resolve(this.context, "luban.config.js");
        try {
            fileConfig = require(configPath);
            if (!fileConfig || typeof fileConfig !== "object") {
                cli_shared_utils_1.error(`Error loading ${chalk_1.default.bold("luban.config.js")}: should export an object.`);
                fileConfig = null;
            }
        }
        catch (e) { }
        pkgConfig = this.pkg.luban;
        if (pkgConfig && typeof pkgConfig !== "object") {
            cli_shared_utils_1.error(`Error loading luban-cli config in ${chalk_1.default.bold(`package.json`)}: ` +
                `the "luban" field should be an object.`);
            pkgConfig = null;
        }
        if (fileConfig) {
            if (pkgConfig) {
                cli_shared_utils_1.warn(`"luban" field in ${chalk_1.default.bold(`package.json`)} ignored ` +
                    `due to presence of ${chalk_1.default.bold("luban.config.js")}.`);
            }
            resolved = fileConfig;
        }
        else if (pkgConfig) {
            resolved = pkgConfig;
        }
        else {
            resolved = inlineOptions || {};
        }
        ensureSlash(resolved, "base");
        removeSlash(resolved, "outputDir");
        options_1.validateProjectConfig(resolved);
        return resolved;
    }
    resolveLubanConfig() {
        let initConfig = defaultPreset;
        const pkg = this.resolvePkg();
        if (pkg.__luban_config__) {
            initConfig = pkg.__luban_config__;
        }
        return initConfig;
    }
}
exports.Service = Service;
//# sourceMappingURL=Service.js.map