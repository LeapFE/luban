"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_shared_utils_1 = require("@luban-cli/cli-shared-utils");
const chalk_1 = __importDefault(require("chalk"));
const constants_1 = require("./../constants");
function printValue(value) {
    if (typeof value === "string") {
        return chalk_1.default.yellowBright(value);
    }
    if (typeof value === "boolean") {
        return chalk_1.default.yellowBright("✔");
    }
    if (Array.isArray(value)) {
        return chalk_1.default.yellowBright(value.join(", "));
    }
    return "";
}
function printDefaultPreset(preset) {
    cli_shared_utils_1.log();
    cli_shared_utils_1.log("List default preset");
    Object.keys(preset).forEach((key) => {
        if (key === "plugins" || key === "configs") {
            return;
        }
        if (key === "uiLibrary" && preset["uiLibrary"].length === 0) {
            return;
        }
        cli_shared_utils_1.log(`  ${chalk_1.default.green(constants_1.defaultPresetNameMap[key])}: ${printValue(preset[key])}`);
    });
    cli_shared_utils_1.log();
}
exports.printDefaultPreset = printDefaultPreset;
//# sourceMappingURL=printPreset.js.map