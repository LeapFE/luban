"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const packageManager_1 = require("../utils/packageManager");
const promptModuleAPI_1 = require("./promptModuleAPI");
const sortObject_1 = require("../utils/sortObject");
const getReadme_1 = require("./../utils/getReadme");
const getVersions_1 = require("../utils/getVersions");
const cli_shared_utils_1 = require("@luban-cli/cli-shared-utils");
const generator_1 = require("./generator");
const constants_1 = require("../constants");
class Creator {
    constructor(name, context, options, promptModules) {
        this.name = name;
        this.options = options;
        this.context = context;
        this.installLocalPlugin = options.localPlugin || false;
        this.run = this.run.bind(this);
        this.shouldInitGit = this.shouldInitGit.bind(this);
        this.formatConfigFiles = this.formatConfigFiles.bind(this);
        this.injectedPrompts = [];
        this.promptCompletedCallbacks = [];
        this.outroPrompts = this.resolveOutroPrompts();
        const promptAPI = new promptModuleAPI_1.PromptModuleAPI(this);
        promptModules.forEach((m) => m(promptAPI));
    }
    async create() {
        const { options, context, name, shouldInitGit, run, formatConfigFiles } = this;
        if (!options.manual) {
            const useDefaultPreset = await this.confirmUseDefaultPrest();
            if (!useDefaultPreset) {
                cli_shared_utils_1.warn("You cancel current operation.");
                process.exit(1);
            }
        }
        const preset = await this.promptAndResolvePreset(options.manual || false);
        const adaptedPreset = lodash_clonedeep_1.default(preset);
        const rootOptions = { projectName: name, preset };
        adaptedPreset.plugins["@luban-cli/cli-plugin-service"] = rootOptions;
        const packageManager = this._pkgManager || "npm";
        const pkgManager = new packageManager_1.PackageManager({ context, forcePackageManager: packageManager });
        cli_shared_utils_1.logWithSpinner(`✨`, `Creating project in ${chalk_1.default.yellow(context)}.`);
        cli_shared_utils_1.log();
        const { latestMinor } = await getVersions_1.getVersions();
        const pkg = {
            name,
            version: "0.1.0",
            private: true,
            devDependencies: {},
            ["__luban_config__"]: adaptedPreset,
        };
        const deps = Object.keys(adaptedPreset.plugins);
        deps.forEach((dep) => {
            let packageDirName = "";
            let packageDirPath = "";
            const packageDirNameMatchResult = /^@luban-cli\/(cli-plugin-.+)$/.exec(dep);
            if (Array.isArray(packageDirNameMatchResult)) {
                packageDirName = packageDirNameMatchResult[1];
                packageDirPath = path_1.default.resolve(process.cwd(), `../../${packageDirName}`);
            }
            pkg.devDependencies[dep] = this.installLocalPlugin
                ? `file:${packageDirPath}`
                : `~${latestMinor}`;
        });
        await cli_shared_utils_1.writeFileTree(context, {
            "package.json": JSON.stringify(pkg, null, 2),
        });
        const shouldInitGitFlag = shouldInitGit(options);
        if (shouldInitGitFlag) {
            cli_shared_utils_1.logWithSpinner(`🗃`, `Initializing git repository...`);
            await run("git init");
        }
        cli_shared_utils_1.log();
        cli_shared_utils_1.stopSpinner();
        cli_shared_utils_1.log(`⚙\u{fe0f}  Installing CLI plugins. This might take a while...`);
        cli_shared_utils_1.log();
        await pkgManager.install();
        cli_shared_utils_1.log();
        const resolvedPlugins = await this.resolvePlugins(lodash_clonedeep_1.default(adaptedPreset.plugins));
        cli_shared_utils_1.log(`🚀  Invoking plugin's generators...`);
        const generator = new generator_1.Generator(context, { plugins: resolvedPlugins, pkg: pkg });
        await generator.generate();
        cli_shared_utils_1.log();
        cli_shared_utils_1.stopSpinner();
        cli_shared_utils_1.log(`📦   Installing additional dependencies...`);
        await pkgManager.install();
        cli_shared_utils_1.log();
        cli_shared_utils_1.stopSpinner();
        cli_shared_utils_1.logWithSpinner("📄   Generating README.md...");
        await cli_shared_utils_1.writeFileTree(context, {
            "README.md": getReadme_1.generateReadme(generator.pkg, packageManager),
        });
        cli_shared_utils_1.log();
        cli_shared_utils_1.log();
        cli_shared_utils_1.stopSpinner();
        cli_shared_utils_1.log("🎨  formatting some file...");
        try {
            await formatConfigFiles(adaptedPreset);
        }
        catch (e) {
            cli_shared_utils_1.warn("format file failure, but does not effect to create project");
        }
        cli_shared_utils_1.log();
        cli_shared_utils_1.log(chalk_1.default.green("🎉   create project successfully!"));
        cli_shared_utils_1.log(`
      ${chalk_1.default.bgWhiteBright.black("🚀   Run Application  ")}
      ${chalk_1.default.yellow(`cd ${name}`)}
      ${chalk_1.default.yellow("npm start")}
    `);
        cli_shared_utils_1.log();
        cli_shared_utils_1.log(`🔗  More documentation to visit ${chalk_1.default.underline(`${require("./../../package.json").homepage}`)}`);
        cli_shared_utils_1.log();
        cli_shared_utils_1.log(chalk_1.default.redBright("💻   Happy coding"));
        cli_shared_utils_1.log();
        generator.printExitLogs();
        process.exit(1);
    }
    run(command, args) {
        if (!args) {
            [command, ...args] = command.split(/\s+/);
        }
        return execa_1.default(command, args, { cwd: this.context });
    }
    async formatConfigFiles(preset) {
        const { run } = this;
        const formatArgs = ["--parser=json", "--write"];
        const formatFiles = ["./.babelrc", "./.eslintrc", "./.postcssrc"];
        if (preset.stylelint) {
            formatFiles.push("./.stylelintrc ");
        }
        if (preset.language === "ts") {
            formatFiles.push("./tsconfig.json");
        }
        await run("./node_modules/prettier/bin-prettier.js", formatArgs.concat(formatFiles));
    }
    async promptAndResolvePreset(manual) {
        if (!manual) {
            return constants_1.defaultPreset;
        }
        const answers = await inquirer_1.default.prompt(this.resolveFinalPrompts());
        const preset = {
            plugins: { "@luban-cli/cli-plugin-service": {} },
        };
        this.promptCompletedCallbacks.forEach((cb) => cb(answers, preset));
        return preset;
    }
    printDefaultPreset() {
        cli_shared_utils_1.log();
        cli_shared_utils_1.log("List default prest");
        Object.keys(constants_1.defaultPreset).forEach((key) => {
            if (key === "plugins" || key === "configs") {
                return;
            }
            cli_shared_utils_1.log(`  ${chalk_1.default.green(key)}: ${chalk_1.default.yellowBright(constants_1.defaultPreset[key])}`);
        });
        cli_shared_utils_1.log();
    }
    async confirmUseDefaultPrest() {
        const { useDefaultPreset } = await inquirer_1.default.prompt([
            {
                type: "confirm",
                name: "useDefaultPreset",
                message: constants_1.confirmUseDefaultPresetMsg,
                default: true,
            },
        ]);
        this.printDefaultPreset();
        return useDefaultPreset;
    }
    shouldInitGit(cliOptions) {
        if (!cli_shared_utils_1.hasGit()) {
            return false;
        }
        if (cliOptions.skipGit) {
            return false;
        }
        if (cliOptions.forceGit) {
            return true;
        }
        if (typeof cliOptions.git === "string") {
            return true;
        }
        return !cli_shared_utils_1.hasProjectGit(this.context);
    }
    resolveFinalPrompts() {
        this.injectedPrompts.forEach((prompt) => {
            const originalWhen = prompt.when || (() => true);
            prompt.when = function (answers) {
                if (typeof originalWhen === "function") {
                    return originalWhen(answers);
                }
                return originalWhen;
            };
        });
        return [...this.injectedPrompts, ...this.outroPrompts];
    }
    resolveOutroPrompts() {
        const outroPrompts = [];
        return outroPrompts;
    }
    async resolvePlugins(rawPlugins) {
        const sortedRawPlugins = sortObject_1.sortObject(rawPlugins, ["@luban-cli/cli-plugin-service"], true);
        const plugins = [];
        const pluginIDs = Object.keys(sortedRawPlugins);
        const loadPluginGeneratorWithWarn = (id, context) => {
            let generatorApply = cli_shared_utils_1.loadModule(`${id}/dist/generator`, context);
            if (typeof generatorApply !== "function") {
                cli_shared_utils_1.warn(`generator of plugin [${id}] not found while resolving plugin, use default generator function instead`);
                generatorApply = () => undefined;
            }
            return generatorApply;
        };
        for (const id of pluginIDs) {
            plugins.push({
                id: id,
                apply: loadPluginGeneratorWithWarn(id, this.context),
                options: sortedRawPlugins[id] || {},
            });
        }
        return plugins;
    }
}
exports.Creator = Creator;
//# sourceMappingURL=creator.js.map