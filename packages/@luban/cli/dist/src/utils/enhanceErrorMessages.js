"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const chalk_1 = __importDefault(require("chalk"));
function enhanceErrorMessages(methodName, log) {
    commander_1.default.Command.prototype[methodName] = function (...args) {
        if (methodName === "unknownOption" && this._allowUnknownOption) {
            return;
        }
        this.outputHelp();
        console.log(`  ` + chalk_1.default.red(log(...args)));
        console.log();
        process.exit(1);
    };
}
exports.enhanceErrorMessages = enhanceErrorMessages;
//# sourceMappingURL=enhanceErrorMessages.js.map