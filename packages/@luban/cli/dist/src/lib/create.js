"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function getPromptModules() {
    return [
        "language",
        "linter",
        "cssPreprocessor",
        "stylelint",
        "router",
        "store",
        "unit",
        "UILibrary",
    ].map((file) => require(`./promptModules/${file}`).default);
}
function create(projectName, options) {
    return __awaiter(this, void 0, void 0, function* () {
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
                yield fs_extra_1.default.remove(targetDir);
            }
            else {
                cli_shared_utils_1.clearConsole();
                if (inCurrent) {
                    const { ok } = yield inquirer_1.default.prompt([
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
                    const { action } = yield inquirer_1.default.prompt([
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
                        yield fs_extra_1.default.remove(targetDir);
                        console.log();
                    }
                }
            }
        }
        const creator = new creator_1.Creator(name, targetDir, options, getPromptModules());
        yield creator.create();
    });
}
function init(projectName, options) {
    return create(projectName, options).catch((error) => {
        cli_shared_utils_1.stopSpinner(false);
        console.log(chalk_1.default.red(error));
    });
}
exports.init = init;
//# sourceMappingURL=create.js.map