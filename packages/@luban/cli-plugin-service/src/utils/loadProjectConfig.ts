import { error, warn, Spinner, loadFile } from "@luban-cli/cli-shared-utils";
import chalk from "chalk";
import shell from "shelljs";
import path from "path";
import fs from "fs-extra";

import { isObject } from "../commands/help";
import { validateProjectConfig } from "../lib/options";

import { ProjectConfig } from "../main";
import { padTailSlash, cleanAssetPath } from "./cleanAssetPath";

function requireSpecifiedConfigFile<T>(
  filePath: string,
  context: string,
  configFilename: string,
): T | undefined {
  const spinner = new Spinner();
  spinner.logWithSpinner(`compiling ${chalk.green(configFilename)} ... \n`);

  const configTempDir = path.resolve(context, "node_modules/@luban-cli/cli-plugin-service/temp");
  const configTempDirPath = path.resolve(`${configTempDir}/${configFilename}`);

  try {
    const tscBinPath = `${context}/node_modules/typescript/bin/tsc`;
    const compileArgs = `--module commonjs --skipLibCheck --esModuleInterop --outDir ${configTempDir}`;
    const { code } = shell.exec(`${tscBinPath} ${filePath} ${compileArgs}`);

    if (code !== 0) {
      // ignore compile error, just print warn
      warn(`compiled ${chalk.bold(configFilename)} file failure \n`);
    }
  } catch (e) {}

  let configModule = undefined;

  try {
    configModule = loadFile<T>(`${configTempDirPath.replace(/(.+)(\.ts)/gi, "$1.js")}`);
  } catch (e) {
    spinner.stopSpinner();
  }

  spinner.stopSpinner();

  return configModule;
}

export function loadProjectOptions(
  context: string,
  configFilename: string,
): Partial<ProjectConfig> {
  let fileConfig: Partial<ProjectConfig> | null = null;
  let resolved: Partial<ProjectConfig> = {};

  const configPath = path.resolve(context, configFilename);

  if (!fs.pathExistsSync(configPath)) {
    error(`specified config file ${chalk.bold(`${configPath}`)} nonexistent, please check it.`);
    process.exit();
  }

  try {
    let _fileConfig = requireSpecifiedConfigFile<Partial<ProjectConfig>>(
      configPath,
      context,
      configFilename,
    );

    if (!_fileConfig || typeof _fileConfig !== "object") {
      error(`Error load ${chalk.bold(`${configFilename}`)}: should export an object. \n`);
      _fileConfig = undefined;
    }

    if (isObject(_fileConfig)) {
      fileConfig = _fileConfig;
    }
  } catch (e) {}

  if (fileConfig) {
    resolved = fileConfig;
  } else {
    resolved = {};
  }

  resolved.publicPath = resolved.publicPath
    ? padTailSlash(resolved.publicPath)
    : resolved.publicPath;
  resolved.outputDir = resolved.outputDir ? cleanAssetPath(resolved.outputDir) : resolved.outputDir;

  validateProjectConfig(resolved, (msg) => {
    error(`Invalid options in ${chalk.bold(configFilename)}: ${msg}`);
  });

  return resolved;
}
