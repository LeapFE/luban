import { Preset } from "@luban-cli/cli-shared-types/dist/shared";
import { log } from "@luban-cli/cli-shared-utils";
import chalk from "chalk";

import { defaultPresetNameMap } from "./../constants";

function printValue(value: unknown): string {
  if (typeof value === "string") {
    return chalk.yellowBright(value);
  }
  if (typeof value === "boolean") {
    return chalk.yellowBright("✔");
  }
  if (Array.isArray(value)) {
    return chalk.yellowBright(value.join(", "));
  }

  return "";
}

export function printDefaultPreset(preset: Required<Preset>): void {
  log();
  log("List default preset");
  Object.keys(preset).forEach((key: string) => {
    if (key === "plugins" || key === "configs") {
      return;
    }
    if (key === "uiLibrary" && preset["uiLibrary"].length === 0) {
      return;
    }
    log(`  ${chalk.green(defaultPresetNameMap[key])}: ${printValue(preset[key])}`);
  });
  log();
}
