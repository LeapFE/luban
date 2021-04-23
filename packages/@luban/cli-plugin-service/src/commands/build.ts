import { log, done, info } from "@luban-cli/cli-shared-utils";
import webpack = require("webpack");
import path from "path";
import chalk from "chalk";

import { formatStats, logStatsErrorsAndWarnings } from "../utils/formatStats";
import { delay } from "../utils/serverRender";
import { cleanDest } from "../utils/clean";
import { buildServerSideDeployFIle } from "../utils/buildServerSideDeployFile";

import { CommandPluginAPI } from "../lib/PluginAPI";
import {
  BuildCliArgs,
  ParsedArgs,
  CommandPluginInstance,
  CommandPluginApplyCallbackArgs,
  CommandPluginAddWebpackConfigCallbackArgs,
} from "../definitions";
import { ProjectConfig } from "../main";

class Build {
  private api: CommandPluginAPI;
  private projectConfig: ProjectConfig;

  private outputDir: string;

  constructor(api: CommandPluginAPI, projectConfig: ProjectConfig, args: ParsedArgs<BuildCliArgs>) {
    this.api = api;
    this.projectConfig = projectConfig;

    let output = projectConfig.outputDir;

    if (args.dest) {
      output = args.dest;
    }

    this.outputDir = api.resolve(output);
  }

  private async buildClient() {
    const webpackConfig = this.api.resolveWebpackConfig(
      "client",
      this.api.resolveChainableWebpackConfig("client"),
    );

    return new Promise<void>((resolve, reject) => {
      if (!webpackConfig) {
        reject("client side webpack config unable resolved; command [build]");
        return;
      }

      webpack(webpackConfig, (err, stats) => {
        // Fatal webpack errors (wrong configuration, etc)
        if (err) {
          return reject(err);
        }

        logStatsErrorsAndWarnings(stats);

        // Compilation errors (missing modules, syntax errors, eslint-errors. etc)
        if (stats.hasErrors()) {
          return reject("Build failed with some Compilation errors occurred.");
        }

        const targetDirShort = path.relative(this.api.getContext(), this.outputDir);
        log(formatStats(stats, targetDirShort, this.api));
        console.log();
        done(
          `Client Build complete. The ${chalk.cyan(
            targetDirShort,
          )} directory is ready to be deployed.`,
        );

        resolve();
      });
    });
  }

  private async buildServer() {
    const webpackConfig = this.api.resolveWebpackConfig(
      "server",
      this.api.resolveChainableWebpackConfig("server"),
    );
    return new Promise<void>((resolve, reject) => {
      if (!webpackConfig) {
        reject("server side webpack config unable resolved; command [build]");
        return;
      }

      webpack(webpackConfig, (err, stats) => {
        if (err || stats.hasErrors()) {
          reject();
          return;
        }

        const targetDirShort = path.relative(this.api.getContext(), this.outputDir);

        log(formatStats(stats, targetDirShort, this.api));
        console.log();
        done(
          `Server Build complete. The file ${chalk.cyan(
            `${targetDirShort}/server.js`,
          )} is ready to be deployed.`,
        );
        console.log();

        resolve();
      });
    });
  }

  public async start() {
    const ctx = this.api.getContext();

    info(`clean dest files...`);

    await cleanDest(ctx, this.outputDir);

    await delay(1000);

    console.log();

    const queue = [this.buildClient];

    if (this.projectConfig.ssr) {
      queue.push(this.buildServer);
    }

    await Promise.all(queue.map((q) => q.call(this)));

    console.log();

    if (this.projectConfig.ssr) {
      await buildServerSideDeployFIle(this.outputDir);
    }

    console.log();
    info("Done 🎉");

    ["SIGINT", "SIGTERM"].forEach((signal) => {
      process.on(signal, () => {
        process.exit();
      });
    });
  }
}

export default class BuildWrapper implements CommandPluginInstance<BuildCliArgs> {
  apply(params: CommandPluginApplyCallbackArgs<BuildCliArgs>) {
    const { api, projectConfig, args } = params;

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
      async () => {
        info("Building... \n");

        const build = new Build(api, projectConfig, args);
        await build.start();
      },
    );
  }

  addWebpackConfig(params: CommandPluginAddWebpackConfigCallbackArgs) {
    const { api, projectConfig } = params;

    api.addWebpackConfig("server");

    if (projectConfig.ssr) {
      api.addWebpackConfig("server");
    }
  }
}
