import { logWithSpinner, stopSpinner, log, done } from "@luban-cli/cli-shared-utils";
import webpack from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import path from "path";
import chalk from "chalk";
import { formatStats, logStatsErrorsAndWarnings } from "./../utils/formatStats";

import { PluginAPI } from "./../lib/PluginAPI";
import { ProjectConfig, BuildCliArgs, ParsedArgs } from "./../definitions";

async function build(
  args: ParsedArgs<BuildCliArgs>,
  api: PluginAPI,
  options: Required<ProjectConfig>,
): Promise<void> {
  logWithSpinner("Build bundle... \n");

  if (args.dest) {
    options.outputDir = args.dest;
  }

  const targetDir = api.resolve(options.outputDir);

  const webpackConfig = api.resolveWebpackConfig(api.resolveChainableWebpackConfig());

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
      stopSpinner();

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
        "--mode": "specify env mode (default: production)",
        "--dest": "specify output directory (default: ${options.outputDir})",
        "--report": "generate report.html to help analyze bundle content",
      },
    },
    async (args: ParsedArgs<BuildCliArgs>) => {
      const entryFileOfApp = api.isTSProject() ? "index.tsx" : "index.jsx";
      args.entry = args.entry || `src/${entryFileOfApp}`;

      await build(args, api, options);
    },
  );
}
