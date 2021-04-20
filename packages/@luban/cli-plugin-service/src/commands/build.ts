import { Spinner, log, done, info } from "@luban-cli/cli-shared-utils";
import webpack = require("webpack");
import path from "path";
import chalk from "chalk";
import fs from "fs-extra";

import { formatStats, logStatsErrorsAndWarnings } from "../utils/formatStats";
import { delay } from "../utils/serverRender";
import { produceBoilerplate, produceRoutesAndStore } from "../lib/produce";
import { CommandPluginAPI } from "../lib/PluginAPI";
import {
  BuildCliArgs,
  ParsedArgs,
  CommandPluginInstance,
  CommandPluginApplyCallbackArgs,
} from "../definitions";
import { ProjectConfig } from "../main";

class Build {
  private api: CommandPluginAPI;

  private outputDir: string;

  constructor(api: CommandPluginAPI, projectConfig: ProjectConfig, args: ParsedArgs<BuildCliArgs>) {
    this.api = api;

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

        const targetDirShort = path.relative(this.api.service.context, this.outputDir);
        log(formatStats(stats, targetDirShort, this.api));
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
    return new Promise((resolve, reject) => {
      webpack(webpackConfig, (err, stats) => {
        if (err || stats.hasErrors()) {
          reject();
          return;
        }

        resolve();
      });
    });
  }

  private async buildDeploy() {
    return new Promise((resolve, reject) => {
      const entry = path.join(this.outputDir, "/server.js");
      webpack(
        {
          mode: "development",
          entry,
          target: "node",
          output: {
            path: this.outputDir,
            filename: "server.js",
            libraryTarget: "commonjs2",
          },
          optimization: {
            splitChunks: false,
          },
        },
        (err) => {
          if (err) {
            console.log(err);
            reject();
            return;
          }

          resolve();
        },
      );
    });
  }

  public async start() {
    const ctx = this.api.getContext();

    const isLubanDirExists = fs.pathExistsSync(ctx + "src/.luban");
    if (!isLubanDirExists) {
      await produceBoilerplate(ctx);
    }

    await produceRoutesAndStore(ctx);

    await delay(1000);

    console.log();

    await Promise.all([this.buildClient(), this.buildServer()]);

    info("generate server side deploy file");

    const template = fs.readFileSync(this.outputDir + "/server.ejs", { encoding: "utf-8" });

    fs.writeFileSync(
      this.outputDir + "/server_template.js",
      `module.exports = ${JSON.stringify(template)}`,
      {
        encoding: "utf-8",
      },
    );

    fs.copyFileSync(__dirname + "../utils/server.js", this.outputDir + "/server.js");
    fs.copyFileSync(__dirname + "../utils/server.d.ts", this.outputDir + "/server.d.ts");

    await this.buildDeploy();

    fs.removeSync(this.outputDir + "/server_template.js");
    fs.removeSync(this.outputDir + "/server-bundle.js");
    fs.removeSync(this.outputDir + "/server.ejs");

    console.log();
    info("Done");

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
        const spinner = new Spinner();
        spinner.logWithSpinner("Building... \n");

        const build = new Build(api, projectConfig, args);
        await build.start();

        spinner.stopSpinner();
      },
    );
  }
}
