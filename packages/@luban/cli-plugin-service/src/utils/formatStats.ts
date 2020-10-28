import webpack = require("webpack");
import { log, error, warn } from "@luban-cli/cli-shared-utils";
import fs from "fs";
import path from "path";
import zlib from "zlib";
import chalk from "chalk";
import url from "url";
import CliUI = require("cliui");

const UI = CliUI({ width: 80 });

import { PluginAPI } from "../lib/PluginAPI";

type Asset = {
  chunks: Array<number | string>;
  chunkNames: string[];
  emitted: boolean;
  isOverSizeLimit?: boolean;
  name: string;
  size: number;
};

export function formatStats(stats: webpack.Stats, dir: string, api: PluginAPI): string {
  const json = stats.toJson({
    hash: false,
    modules: false,
    chunks: false,
  });

  let assets = json.assets;

  if (assets === undefined && Array.isArray(json.children)) {
    assets = json.children.reduce((acc, child) => {
      if (child.assets) {
        return acc.concat(child.assets);
      }

      return acc;
    }, [] as Asset[]);
  }

  if (assets === undefined) {
    return "";
  }

  const seenNames = new Map();
  const isJS = (val: string): boolean => /\.js$/.test(val);
  const isCSS = (val: string): boolean => /\.css$/.test(val);
  const isMinJS = (val: string): boolean => /\.min\.js$/.test(val);

  assets = assets
    .map((a: Asset) => {
      a.name = url.parse(a.name).pathname || "";
      return a;
    })
    .filter((a) => {
      if (seenNames.has(a.name)) {
        return false;
      }
      seenNames.set(a.name, true);
      return isJS(a.name) || isCSS(a.name);
    })
    .sort((a, b) => {
      if (isJS(a.name) && isCSS(b.name)) return -1;
      if (isCSS(a.name) && isJS(b.name)) return 1;
      if (isMinJS(a.name) && !isMinJS(b.name)) return -1;
      if (!isMinJS(a.name) && isMinJS(b.name)) return 1;
      return b.size - a.size;
    });

  function formatSize(size: number): string {
    return (size / 1024).toFixed(2) + " KiB";
  }

  function getGzippedSize(asset: Asset): string {
    const filepath = api.resolve(path.join(dir, asset.name));
    const buffer = fs.readFileSync(filepath);
    return formatSize(zlib.gzipSync(buffer).length);
  }

  function makeRow(a: string, b: string, c: string): string {
    return `  ${a}\t    ${b}\t ${c}`;
  }

  UI.div(
    makeRow(chalk.cyan.bold(`File`), chalk.cyan.bold(`Size`), chalk.cyan.bold(`Gzipped`)) +
      `\n\n` +
      assets
        .map((asset) =>
          makeRow(
            /js$/.test(asset.name)
              ? chalk.green(path.join(dir, asset.name))
              : chalk.blue(path.join(dir, asset.name)),
            formatSize(asset.size),
            getGzippedSize(asset),
          ),
        )
        .join(`\n`),
  );

  return `${UI.toString()}\n\n  ${chalk.gray(`Images and other types of assets omitted.`)}\n`;
}

export function logStatsErrorsAndWarnings(stats: webpack.Stats): void {
  if (stats.hasWarnings()) {
    log("Some warnings occurred while compiling");
    log();
    const { warnings } = stats.toJson({ warnings: true, errors: false });
    warnings.forEach((warning) => {
      warn(warning);
    });
    log();
  }

  // Compilation errors (missing modules, syntax errors, etc)
  if (stats.hasErrors()) {
    log();
    const { errors } = stats.toJson({ warnings: false, moduleTrace: false });
    errors.forEach((err) => {
      error(err);
    });
    log();
  }
}
