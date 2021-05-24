import { Preset } from "@luban-cli/cli-shared-types/dist/shared";
import { log } from "@luban-cli/cli-shared-utils";
import chalk from "chalk";

import { defaultPresetNameMap } from "./../constants";

function printValue(value: unknown): string {
  if (typeof value === "string") {
    if (value.length > 0) {
      return chalk.yellowBright(value);
    }

    return chalk.redBright("UNKNOWN");
  }

  if (typeof value === "boolean") {
    if (value) {
      return chalk.yellowBright("✔");
    }
    return chalk.yellowBright("x");
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

    if (key === "type") {
      return;
    }

    if (typeof preset[key] === "boolean" && !preset[key]) {
      return;
    }

    if (typeof preset[key] === "string" && preset[key].length === 0) {
      return;
    }

    log(`  ${chalk.green(defaultPresetNameMap[key])}: ${printValue(preset[key])}`);
  });
}
