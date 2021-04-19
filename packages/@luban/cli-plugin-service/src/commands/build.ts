import { Spinner, log, done } from "@luban-cli/cli-shared-utils";
import webpack = require("webpack");
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import path from "path";
import chalk from "chalk";

import { formatStats, logStatsErrorsAndWarnings } from "../utils/formatStats";
import { CommandPluginAPI } from "../lib/PluginAPI";
import {
  BuildCliArgs,
  ParsedArgs,
  CommandPluginInstance,
  CommandPluginApplyCallbackArgs,
} from "../definitions";
import { ProjectConfig } from "../main";

async function build(
  args: ParsedArgs<BuildCliArgs>,
  api: CommandPluginAPI,
  options: ProjectConfig,
): Promise<void> {
  const spinner = new Spinner();
  spinner.logWithSpinner("Build bundle... \n");

  if (args.dest) {
    options.outputDir = args.dest;
  }

  const targetDir = api.resolve(options.outputDir);

  const webpackConfig = api.resolveWebpackConfig(
    "client",
    api.resolveChainableWebpackConfig("client"),
  );

  if (args.report) {
    if (Array.isArray(webpackConfig.plugins)) {
      webpackConfig.plugins.push(
        new BundleAnalyzerPlugin({
          logLevel: "error",
          openAnalyzer: false,
          analyzerMode: args.report ? "static" : "disabled",
          reportFilename: "report.html",
        }),
      );
    }
  }

  return new Promise<void>((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      spinner.stopSpinner();

      // Fatal webpack errors (wrong configuration, etc)
      if (err) {
        return reject(err);
      }

      logStatsErrorsAndWarnings(stats);

      // Compilation errors (missing modules, syntax errors, eslint-errors. etc)
      if (stats.hasErrors()) {
        return reject("Build failed with some Compilation errors occurred.");
      }

      const targetDirShort = path.relative(api.service.context, targetDir);
      log(formatStats(stats, targetDirShort, api));
      done(`Build complete. The ${chalk.cyan(targetDirShort)} directory is ready to be deployed.`);

      resolve();
    });
  });
}

export default class Build implements CommandPluginInstance {
  apply(params: CommandPluginApplyCallbackArgs) {
    const { api, projectConfig } = params;

    api.registerCommand(
      "build",
      {
        description: "build for production",
        usage: "luban-cli-service build [options]",
        options: {
          "--mode": "specify env mode (default: production)",
          "--dest": `specify output directory (default: ${projectConfig.outputDir})`,
          "--report": "generate report.html to help analyze bundle content",
        },
      },
      async (args: ParsedArgs<BuildCliArgs>) => {
        await build(args, api, projectConfig);
      },
    );
  }
}
