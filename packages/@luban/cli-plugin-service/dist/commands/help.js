"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
function getPadLength(obj) {
    let longest = 10;
    for (const name in obj) {
        if (name.length + 1 > longest) {
            longest = name.length + 1;
        }
    }
    return longest;
}
function logMainHelp(api) {
    console.log(`\n  Usage: luban-cli-service <command> [options]\n` + `\n  Commands:\n`);
    const commands = api.service.commands;
    const padLength = getPadLength(commands);
    for (const name in commands) {
        if (name !== "help") {
            const opts = commands[name].opts || {};
            console.log(`    ${chalk_1.default.blue(name.padEnd(padLength))}${opts.description || ""}`);
        }
    }
    console.log(`\n  run ${chalk_1.default.green(`luban-cli-service help [command]`)} for usage of a specific command.\n`);
}
function logHelpForCommand(name, command) {
    if (!command) {
        console.log(chalk_1.default.red(`\n  command "${name}" unregistered.`));
    }
    else {
        const opts = command.opts || {};
        if (opts.usage) {
            console.log(`\n  Usage: ${opts.usage}`);
        }
        if (opts.options) {
            console.log(`\n  Options:\n`);
            const padLength = getPadLength(opts.options);
            for (const [flags, description] of Object.entries(opts.options)) {
                console.log(`    ${chalk_1.default.blue(flags.padEnd(padLength))}${description}`);
            }
        }
        if (opts.details) {
            console.log();
            console.log(opts.details
                .split("\n")
                .map((line) => `  ${line}`)
                .join("\n"));
        }
        console.log();
    }
}
function default_1(api) {
    api.registerCommand("help", (args) => {
        const commandName = args._[0];
        if (!commandName) {
            logMainHelp(api);
        }
        else {
            logHelpForCommand(commandName, api.service.commands[commandName]);
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=help.js.map