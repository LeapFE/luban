import path from "path";
import dotenvExpand from "dotenv-expand";
import { config as dotenvConfig } from "dotenv";
import { log, info } from "@luban-cli/cli-shared-utils";
import chalk from "chalk";

import { builtinServiceCommandName } from "../definitions";

export function loadAndSetEnv(
  mode: string,
  context: string,
  commandName: builtinServiceCommandName,
): void {
  const basePath = path.resolve(context, ".env");
  const baseModePath = path.resolve(context, `.env.${mode}`);
  const localModePath = `${baseModePath}.local`;

  const load = (path: string): void => {
    const env = dotenvConfig({ path });
    dotenvExpand(env);

    if (!env.error) {
      info(`loaded dotenv file ${chalk.green(path)} successfully`);
    }

    log();
  };

  // this load order is important
  // env.[mode].local has first priority, env.[mode] has second priority and .env has lowest priority
  // if the three files exist
  load(localModePath);
  load(baseModePath);
  load(basePath);

  const writeEnv = (key: string, value: string): void => {
    Object.defineProperty(process.env, key, {
      value: value,
      writable: false,
      configurable: false,
      enumerable: true,
    });
  };

  if (mode && commandName === "inspect") {
    const _mode = mode === "development" ? "development" : "production";
    writeEnv("NODE_ENV", _mode);
    writeEnv("BABEL_ENV", _mode);
  }

  if (commandName === "serve") {
    writeEnv("NODE_ENV", "development");
    writeEnv("BABEL_ENV", "development");
  }

  if (commandName === "build") {
    writeEnv("NODE_ENV", "production");
    writeEnv("BABEL_ENV", "production");
  }
}
