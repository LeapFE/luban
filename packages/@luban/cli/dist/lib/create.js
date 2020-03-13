"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const validate_npm_package_name_1 = __importDefault(require("validate-npm-package-name"));
const cli_shared_utils_1 = require("@luban-cli/cli-shared-utils");
const creator_1 = require("./creator");
const constants_1 = require("./../constants");
function getPromptModules() {
    return constants_1.defaultPromptModule.map((file) => require(`./promptModules/${file}`).default);
}
async function create(projectName, options) {
    const cwd = process.cwd();
    const inCurrent = projectName === ".";
    const name = inCurrent ? path_1.default.relative("../", cwd) : projectName;
    const targetDir = path_1.default.resolve(cwd, projectName || ".");
    const result = validate_npm_package_name_1.default(name);
    if (!result.validForNewPackages) {
        console.error(chalk_1.default.red(`Invalid project name: "${name}"`));
        result.errors &&
            result.errors.forEach((err) => {
                console.error(chalk_1.default.red.dim("Error: " + err));
            });
        result.warnings &&
            result.warnings.forEach((warn) => {
                console.error(chalk_1.default.red.dim("Warning: " + warn));
            });
        process.exit(1);
    }
    if (fs_extra_1.default.existsSync(targetDir)) {
        if (options.force) {
            await fs_extra_1.default.remove(targetDir);
        }
        else {
            cli_shared_utils_1.clearConsole();
            if (inCurrent) {
                const { ok } = await inquirer_1.default.prompt([
                    {
                        name: "ok",
                        type: "confirm",
                        message: `Generate project in current directory?`,
                    },
                ]);
                if (!ok) {
                    return;
                }
            }
            else {
                const { action } = await inquirer_1.default.prompt([
                    {
                        name: "action",
                        type: "list",
                        message: `Target directory ${chalk_1.default.cyan(targetDir)} already exists. Pick an action:`,
                        choices: [
                            { name: "Overwrite", value: "overwrite" },
                            { name: "Merge", value: "merge" },
                            { name: "Cancel", value: false },
                        ],
                    },
                ]);
                if (!action) {
                    return;
                }
                else if (action === "overwrite") {
                    console.log(`\nRemoving ${chalk_1.default.cyan(targetDir)}...`);
                    await fs_extra_1.default.remove(targetDir);
                    console.log();
                }
            }
        }
    }
    const creator = new creator_1.Creator(name, targetDir, options, getPromptModules());
    await creator.create();
}
function init(projectName, options) {
    return create(projectName, options).catch((error) => {
        const spinner = new cli_shared_utils_1.Spinner();
        spinner.stopSpinner(false);
        console.log(chalk_1.default.red(error));
    });
}
exports.init = init;
//# sourceMappingURL=create.js.map