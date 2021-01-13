import { loadModule, warn, hasProjectGit, hasGit } from "@luban-cli/cli-shared-utils";
import execa, { ExecaChildProcess } from "execa";

import { sortObject } from "../utils/sortObject";

import { ResolvedPlugin, ApplyFn, CliOptions, PLUGIN_ID } from "../definitions";

class BaseCreator {
  public shouldInitGit(cliOptions: CliOptions, path: string): boolean {
    if (!hasGit()) {
      return false;
    }
    if (cliOptions.skipGit) {
      return false;
    }
    // --git
    if (cliOptions.forceGit) {
      return true;
    }

    if (typeof cliOptions.git === "string") {
      return true;
    }

    return !hasProjectGit(path);
  }

  public async resolvePlugins<T extends Record<string, any>>(
    rawPlugins: T,
    context: string,
  ): Promise<ResolvedPlugin[]> {
    const sortedRawPlugins = sortObject(rawPlugins, ["@luban-cli/cli-plugin-service"], true);
    const plugins: ResolvedPlugin[] = [];

    const pluginIDs = Object.keys(sortedRawPlugins);

    const loadPluginGeneratorWithWarn = (id: string, path: string): ApplyFn => {
      let generatorApply = loadModule(`${id}/dist/generator`, path);

      if (typeof generatorApply !== "function") {
        warn(
          `generator of plugin [${id}] not found while resolving plugin, use default generator function instead`,
        );
        generatorApply = (): void => undefined;
      }

      return generatorApply as ApplyFn;
    };

    for (const id of pluginIDs) {
      plugins.push({
        id: id as PLUGIN_ID,
        apply: loadPluginGeneratorWithWarn(id, context),
        options: sortedRawPlugins[id] || {},
      });
    }
    return plugins;
  }

  public run(cwd: string, command: string, args?: string[]): ExecaChildProcess {
    if (!args) {
      [command, ...args] = command.split(/\s+/);
    }
    return execa(command, args, { cwd });
  }
}

export { BaseCreator };
