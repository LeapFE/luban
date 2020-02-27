import { Preset } from "@luban-cli/cli-shared-types/dist/shared";
import { log } from "@luban-cli/cli-shared-utils";
import chalk from "chalk";

import { defaultPresetNameMap } from "./../constants";

export function printDefaultPreset(preset: Required<Preset>): void {
  log();
  log("List default prest");
  Object.keys(preset).forEach((key: string) => {
    if (key === "plugins" || key === "configs") {
      return;
    }
    if (key === "uiLibrary" && preset["uiLibrary"].length === 0) {
      return;
    }
    if (key === "uiLibrary" && preset["uiLibrary"].length > 0) {
      log(
        `  ${chalk.green(defaultPresetNameMap["uiLibrary"])}: ${chalk.yellowBright(
          preset["uiLibrary"].join(", "),
        )}`,
      );
      return;
    }
    log(`  ${chalk.green(defaultPresetNameMap[key])}: ${chalk.yellowBright(preset[key])}`);
  });
  log();
}
