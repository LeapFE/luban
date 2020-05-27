import { PluginAPI } from "./../lib/PluginAPI";
import { InspectCliArgs, ParsedArgs } from "./../definitions";

import Config = require("webpack-chain");
import { highlight } from "cli-highlight";
import chalk from "chalk";
import { get } from "@luban-cli/cli-shared-utils";

export default function(api: PluginAPI): void {
  api.registerCommand(
    "inspect",
    {
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
    },
    (args: ParsedArgs<InspectCliArgs>) => {
      const webpackConfig = api.resolveWebpackConfig();
      const { _: paths } = args;

      let res: Record<string, any>;
      let hasUnnamedRule: boolean = false;
      if (args.rule) {
        res = webpackConfig.module
          ? webpackConfig.module.rules.find((r: any) => (r as any).__ruleNames[0] === args.rule) ||
            {}
          : {};
      } else if (args.plugin) {
        res = webpackConfig.plugins
          ? webpackConfig.plugins.find((p: any) => (p as any).__pluginName === args.plugin) || {}
          : {};
      } else if (args.rules) {
        res = webpackConfig.module
          ? webpackConfig.module.rules.map((r: any) => {
              const name = r.__ruleNames ? r.__ruleNames[0] : "Nameless Rule (*)";

              hasUnnamedRule = hasUnnamedRule || !r.__ruleNames;

              return name;
            })
          : {};
      } else if (args.plugins) {
        res = webpackConfig.plugins
          ? webpackConfig.plugins.map((p: any) => p.__pluginName || p.constructor.name)
          : {};
      } else if (paths.length > 1) {
        res = {};
        paths.forEach((path: string) => {
          res[path] = get(webpackConfig, path);
        });
      } else if (paths.length === 1) {
        res = get(webpackConfig, paths[0]);
      } else {
        res = webpackConfig;
      }

      // class `Config` override `Function.toString`
      // see https://github.com/neutrinojs/webpack-chain/blob/master/src/Config.js#L47
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const output = Config.toString(res, { verbose: args.verbose });
      console.log(highlight(output, { language: "js" }));

      // Log explanation for Nameless Rules
      if (hasUnnamedRule) {
        console.log(`--- ${chalk.green("Footnotes")} ---`);
        console.log(`*: ${chalk.green("Nameless Rules")} were added through the ${chalk.green(
          "configureWebpack()",
        )} API (possibly by a plugin) instead of ${chalk.green("chainWebpack()")} (recommended).
    You can run ${chalk.green(
      "luban-cli-service inspect",
    )} without any arguments to inspect the full config and read these rules' config.`);
      }
    },
  );
}
