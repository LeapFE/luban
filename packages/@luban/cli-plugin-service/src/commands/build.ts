import { Spinner, log, done, error } from "@luban-cli/cli-shared-utils";
import webpack = require("webpack");
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import path from "path";
import chalk from "chalk";
import { formatStats, logStatsErrorsAndWarnings } from "./../utils/formatStats";
import { existsSync } from "fs";

import { PluginAPI } from "./../lib/PluginAPI";
import { BuildCliArgs, ParsedArgs } from "./../definitions";
import { ProjectConfig } from "./../main";

async function build(
  args: ParsedArgs<BuildCliArgs>,
  api: PluginAPI,
  options: Required<ProjectConfig>,
): Promise<void> {
  const spinner = new Spinner();
  spinner.logWithSpinner("Build bundle... \n");

  const defaultEntryFile = api.getEntryFile();
  const entryFile = args.entry || `src/${defaultEntryFile}`;

  if (!existsSync(api.resolve(entryFile))) {
    error(`The entry file ${entryFile} not exit, please check it`);
    process.exit();
  }

  if (args.dest) {
    options.outputDir = args.dest;
  }

  const targetDir = api.resolve(options.outputDir);

  const webpackConfig = api.resolveWebpackConfig(api.resolveChainableWebpackConfig());

  webpackConfig.entry = {
    app: api.resolve(entryFile),
  };

  if (args.report) {
    if (Array.isArray(webpackConfig.plugins)) {
      webpackConfig.plugins.push(
        // because webpack-dev-serve dependent @types/webpack version is not latest, so some type will not assignable
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
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

export default function(api: PluginAPI, options: Required<ProjectConfig>): void {
  api.registerCommand(
    "build",
    {
      description: "build for production",
      usage: "luban-cli-service build [options]",
      options: {
        "--entry": "specify entry file",
        "--config": "specify config file",
        "--mode": "specify env mode (default: production)",
        "--dest": "specify output directory (default: ${options.outputDir})",
        "--report": "generate report.html to help analyze bundle content",
      },
    },
    async (args: ParsedArgs<BuildCliArgs>) => {
      await build(args, api, options);
    },
  );
}
