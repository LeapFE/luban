import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import validateProjectName from "validate-npm-package-name";
import { clearConsole, Spinner } from "@luban-cli/cli-shared-utils";
import updateNotifier from "update-notifier";
import boxen from "boxen";
import pupa from "pupa";

import { CliOptions } from "../definitions";

import { Creator } from "./creator";
import { PromptModuleAPI } from "./promptModuleAPI";

import { defaultPromptModule } from "./../constants";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require("../../package.json");

function getPromptModules(): Array<(api: PromptModuleAPI) => void> {
  return defaultPromptModule.map((file) => require(`./promptModules/${file}`).default);
}

function updateNotify(): void {
  const notifier = updateNotifier({
    pkg: {
      name: pkg.name,
      version: pkg.version,
    },
    // 1 week
    updateCheckInterval: 1000 * 60 * 60 * 24 * 7,
  });

  if (notifier.update) {
    const template =
      "Update available " +
      chalk.dim("{currentVersion}") +
      chalk.reset(" → ") +
      chalk.green("{latestVersion}") +
      " \nRun " +
      chalk.cyan("{updateCommand}") +
      " to update";

    const message =
      "\n" +
      boxen(
        pupa(template, {
          packageName: pkg.name,
          currentVersion: notifier.update.current,
          latestVersion: notifier.update.latest,
          updateCommand: "npm install @luban-cli/cli@latest -g",
        }),
        {
          padding: 1,
          margin: 1,
          align: "center",
          borderColor: "yellow",
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          borderStyle: "classic",
        },
      );

    console.error(message);
  }
}

async function create(projectName: string, options: CliOptions): Promise<void> {
  const cwd = process.cwd();
  const inCurrent = projectName === ".";
  const name = inCurrent ? path.relative("../", cwd) : projectName;
  const targetDir = path.resolve(cwd, projectName || ".");

  const result = validateProjectName(name);
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${name}"`));
    result.errors &&
      result.errors.forEach((err) => {
        console.error(chalk.red.dim("Error: " + err));
      });
    result.warnings &&
      result.warnings.forEach((warn) => {
        console.error(chalk.red.dim("Warning: " + warn));
      });
    process.exit(1);
  }

  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir);
    } else {
      clearConsole();
      if (inCurrent) {
        const { ok } = await inquirer.prompt([
          {
            name: "ok",
            type: "confirm",
            message: `Generate project in current directory?`,
          },
        ]);
        if (!ok) {
          return;
        }
      } else {
        const { action } = await inquirer.prompt([
          {
            name: "action",
            type: "list",
            message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
            choices: [
              { name: "Overwrite", value: "overwrite" },
              { name: "Merge", value: "merge" },
              { name: "Cancel", value: false },
            ],
          },
        ]);
        if (!action) {
          return;
        } else if (action === "overwrite") {
          console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
          await fs.remove(targetDir);
          console.log();
        }
      }
    }
  }

  const creator = new Creator(name, targetDir, options, getPromptModules());
  await creator.create();
}

export function init(projectName: string, options: CliOptions): Promise<void> {
  updateNotify();

  return create(projectName, options).catch((error) => {
    const spinner = new Spinner();
    spinner.stopSpinner(false);
    console.log(chalk.red(error));
  });
}
