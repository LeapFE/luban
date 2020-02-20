"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_PATH = __dirname + "../node_modules";
const commander_1 = __importDefault(require("commander"));
const chalk_1 = __importDefault(require("chalk"));
const envinfo_1 = __importDefault(require("envinfo"));
const didyoumean_1 = __importDefault(require("didyoumean"));
const minimist_1 = __importDefault(require("minimist"));
didyoumean_1.default.threshold = 0.6;
const package_json_1 = __importDefault(require("../package.json"));
const enhanceErrorMessages_1 = require("./utils/enhanceErrorMessages");
const create_1 = require("./lib/create");
function suggestCommands(unknownCommand) {
    const availableCommands = commander_1.default.commands.map((cmd) => {
        return cmd._name;
    });
    const suggestion = didyoumean_1.default(unknownCommand, availableCommands);
    if (suggestion) {
        console.log(`  ` +
            chalk_1.default.red(`Did you mean ${chalk_1.default.yellow(suggestion)}?`));
    }
}
function camelize(str) {
    return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
}
function cleanArgs(cmd) {
    const args = {};
    cmd.options.forEach((o) => {
        const key = camelize(o.long.replace(/^--/, ""));
        if (typeof cmd[key] !== "function" && typeof cmd[key] !== "undefined") {
            args[key] = cmd[key];
        }
    });
    return args;
}
const programName = "luban init";
commander_1.default.version(package_json_1.default.version).usage("<command> [options]");
commander_1.default
    .command("init <project-directory>")
    .description("init a new project")
    .option("-r, --registry <url>", "Use specified npm registry when installing dependencies (only for npm)")
    .option("-s, --skipGit", "Skip git initialization")
    .option("-g, --git [message]", "Force git initialization with initial commit message")
    .option("-f, --force", "Overwrite target directory if it exists")
    .option("-l, --localPlugin", "Install local plugins while create project for test or debug")
    .option("-m, --manual", "Manual select features while create project")
    .action((name, cmd) => {
    if (name === "") {
        console.error("Please specify the project directory:");
        console.log(`  ${chalk_1.default.cyan(programName)} ${chalk_1.default.green("<project-directory>")}`);
        console.log();
        console.log("For example:");
        console.log(`  ${chalk_1.default.cyan(programName)} ${chalk_1.default.green("my-react-app")}`);
        console.log();
        console.log(`Run ${chalk_1.default.cyan(`${programName} --help`)} to see all options.`);
        process.exit(1);
    }
    const options = cleanArgs(cmd);
    if (minimist_1.default(process.argv.slice(3))._.length > 1) {
        console.log(chalk_1.default.yellow("\n Info: You provided more than one argument. The first one will be used as the app's name, the rest are ignored."));
    }
    if (process.argv.includes("-g") || process.argv.includes("--git")) {
        options.forceGit = true;
    }
    if (process.argv.includes("-l") || process.argv.includes("--localPlugin")) {
        process.env.USE_LOCAL_PLUGIN = "true";
    }
    create_1.init(name, options);
});
commander_1.default
    .command("info")
    .description("print debugging information about your environment")
    .action(() => {
    console.log(chalk_1.default.bold("\nEnvironment Info:"));
    envinfo_1.default
        .run({
        System: ["OS", "CPU"],
        Binaries: ["Node", "npm"],
        Browsers: ["Chrome", "Edge", "Firefox", "Safari"],
        npmPackages: ["typescript", "react", "react-dom"],
        npmGlobalPackages: ["luban-react-cli"],
    }, {
        showNotFound: true,
        duplicates: true,
        fullTree: true,
    })
        .then(console.log);
});
commander_1.default.arguments("<command>").action((cmd) => {
    commander_1.default.outputHelp();
    console.log(`  ` + chalk_1.default.red(`Unknown command ${chalk_1.default.yellow(cmd)}.`));
    console.log();
    suggestCommands(cmd);
});
commander_1.default.on("--help", () => {
    console.log();
    console.log(`  Only ${chalk_1.default.green("<project-directory>")} is required.`);
    console.log();
});
enhanceErrorMessages_1.enhanceErrorMessages("missingArgument", (argName) => {
    return `Missing required argument ${chalk_1.default.yellow(`<${argName}>`)}.`;
});
enhanceErrorMessages_1.enhanceErrorMessages("unknownOption", (optionName) => {
    return `Unknown option ${chalk_1.default.yellow(optionName)}.`;
});
enhanceErrorMessages_1.enhanceErrorMessages("optionMissingArgument", (option, flag) => {
    return (`Missing required argument for option ${chalk_1.default.yellow(option.flags)}` +
        (flag ? `, got ${chalk_1.default.yellow(flag)}` : ``));
});
commander_1.default.parse(process.argv);
if (!process.argv.slice(2).length) {
    commander_1.default.outputHelp();
}
//# sourceMappingURL=index.js.map