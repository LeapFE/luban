"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_chain_1 = __importDefault(require("webpack-chain"));
const cli_highlight_1 = require("cli-highlight");
const chalk_1 = __importDefault(require("chalk"));
const cli_shared_utils_1 = require("@luban-cli/cli-shared-utils");
function default_1(api) {
    api.registerCommand("inspect", {
        description: "inspect internal webpack config",
        usage: "luban-cli-service inspect [options] [...paths]",
        options: {
            "--mode": "specify env mode (default: development)",
            "--config": "specify config file",
            "--rule <ruleName>": "inspect a specific module rule",
            "--plugin <pluginName>": "inspect a specific plugin",
            "--rules": "list all module rule names",
            "--plugins": "list all plugin names",
            "--verbose": "show full function definitions in output",
        },
    }, (args) => {
        const webpackConfig = api.resolveWebpackConfig();
        const { _: paths } = args;
        let res;
        let hasUnnamedRule = false;
        if (args.rule) {
            res = webpackConfig.module
                ? webpackConfig.module.rules.find((r) => r.__ruleNames[0] === args.rule) ||
                    {}
                : {};
        }
        else if (args.plugin) {
            res = webpackConfig.plugins
                ? webpackConfig.plugins.find((p) => p.__pluginName === args.plugin) || {}
                : {};
        }
        else if (args.rules) {
            res = webpackConfig.module
                ? webpackConfig.module.rules.map((r) => {
                    const name = r.__ruleNames ? r.__ruleNames[0] : "Nameless Rule (*)";
                    hasUnnamedRule = hasUnnamedRule || !r.__ruleNames;
                    return name;
                })
                : {};
        }
        else if (args.plugins) {
            res = webpackConfig.plugins
                ? webpackConfig.plugins.map((p) => p.__pluginName || p.constructor.name)
                : {};
        }
        else if (paths.length > 1) {
            res = {};
            paths.forEach((path) => {
                res[path] = cli_shared_utils_1.get(webpackConfig, path);
            });
        }
        else if (paths.length === 1) {
            res = cli_shared_utils_1.get(webpackConfig, paths[0]);
        }
        else {
            res = webpackConfig;
        }
        const output = webpack_chain_1.default.toString(res, { verbose: args.verbose });
        console.log(cli_highlight_1.highlight(output, { language: "js" }));
        if (hasUnnamedRule) {
            console.log(`--- ${chalk_1.default.green("Footnotes")} ---`);
            console.log(`*: ${chalk_1.default.green("Nameless Rules")} were added through the ${chalk_1.default.green("configureWebpack()")} API (possibly by a plugin) instead of ${chalk_1.default.green("chainWebpack()")} (recommended).
    You can run ${chalk_1.default.green("luban-cli-service inspect")} without any arguments to inspect the full config and read these rules' config.`);
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=inspect.js.map