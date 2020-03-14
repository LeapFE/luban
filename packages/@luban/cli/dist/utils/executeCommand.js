"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const cli_shared_utils_1 = require("@luban-cli/cli-shared-utils");
exports.executeCommand = async function executeCommand(command, args, cwd) {
    try {
        await execa_1.default(command, args, {
            cwd,
            stdio: command === "npm" ? ["ignore", "ignore", "inherit"] : "inherit",
        }).on("close", (code) => {
            if (code !== 0) {
                cli_shared_utils_1.log(`command failed: ${command} ${args.join(" ")}`);
                return;
            }
        });
    }
    catch (error) {
        cli_shared_utils_1.log(`command failed: ${command} ${args.join(" ")}`);
    }
};
//# sourceMappingURL=executeCommand.js.map