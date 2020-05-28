import execa, { ExecaChildProcess } from "execa";
import inquirer, {
  QuestionCollection,
  Question,
  ListQuestion,
  CheckboxQuestion,
  DistinctQuestion,
} from "inquirer";
import chalk from "chalk";
import path from "path";
import cloneDeep from "lodash.clonedeep";

import { PackageManager } from "../utils/packageManager";
import { PromptModuleAPI } from "./promptModuleAPI";
import { sortObject } from "../utils/sortObject";
import { generateReadme } from "./../utils/getReadme";
import { getVersions } from "../utils/getVersions";
import { printDefaultPreset } from "../utils/printPreset";

import {
  Spinner,
  log,
  hasGit,
  hasProjectGit,
  writeFileTree,
  loadModule,
  warn,
} from "@luban-cli/cli-shared-utils";

import { Generator } from "./generator";

import {
  CliOptions,
  Preset,
  RawPlugin,
  ResolvedPlugin,
  PromptCompleteCallback,
  BasePkgFields,
  PLUGIN_ID,
  SUPPORTED_PACKAGE_MANAGER,
  FinalAnswers,
  ApplyFn,
} from "../definitions";
import { defaultPreset, confirmUseDefaultPresetMsg } from "../constants";

type FeaturePrompt = CheckboxQuestion<Array<{ name: string; value: any; short?: string }>>;

class Creator {
  private name: string;
  private readonly context: string;
  private options: CliOptions;
  public readonly featurePrompt: FeaturePrompt;
  public promptCompletedCallbacks: Array<PromptCompleteCallback>;
  private readonly outroPrompts: Question[];
  public readonly injectedPrompts: DistinctQuestion[];
  private _pkgManager: SUPPORTED_PACKAGE_MANAGER | undefined;
  private readonly installLocalPlugin: boolean;

  constructor(
    name: string,
    context: string,
    options: CliOptions,
    promptModules: Array<(api: PromptModuleAPI) => void>,
  ) {
    this.name = name;
    this.options = options;
    this.context = context;

    this.installLocalPlugin = options.localPlugin || false;

    this.run = this.run.bind(this);
    this.shouldInitGit = this.shouldInitGit.bind(this);
    this.formatConfigFiles = this.formatConfigFiles.bind(this);
    this.fixLintErrors = this.fixLintErrors.bind(this);

    this.injectedPrompts = [];
    this.promptCompletedCallbacks = [];
    this.outroPrompts = this.resolveOutroPrompts();

    const promptAPI = new PromptModuleAPI(this);
    promptModules.forEach((m) => m(promptAPI));
  }

  public async create(): Promise<void> {
    const { options, context, name, shouldInitGit, run, formatConfigFiles, fixLintErrors } = this;

    if (!options.manual) {
      const useDefaultPreset = await this.confirmUseDefaultPrest();
      if (!useDefaultPreset) {
        warn("You cancel current operation.");
        process.exit(1);
      }
    }

    const preset = await this.promptAndResolvePreset(options.manual || false);

    const adaptedPreset = cloneDeep(preset);

    const rootOptions = { projectName: name, preset };

    adaptedPreset.plugins["@luban-cli/cli-plugin-service"] = rootOptions;

    // NOTE unsupported the npm client `yarn`. `this._pkgManager` is always undefined
    const packageManager = this._pkgManager || "npm";
    const pkgManager = new PackageManager({ context, forcePackageManager: packageManager });

    const spinner = new Spinner();

    log();
    spinner.logWithSpinner(`🏗`, `Creating project in ${chalk.yellow(context)}`);

    const { latestMinor } = await getVersions();

    const pkg: BasePkgFields = {
      name,
      description: "A react application",
      version: "0.1.0",
      private: true,
      devDependencies: {},
      ["__luban_config__"]: adaptedPreset,
    };

    const deps = Object.keys(adaptedPreset.plugins);
    deps.forEach((dep: string) => {
      let packageDirName = "";
      let packageDirPath = "";
      const packageDirNameMatchResult = /^@luban-cli\/(cli-plugin-.+)$/.exec(dep);
      if (Array.isArray(packageDirNameMatchResult)) {
        packageDirName = packageDirNameMatchResult[1];
        packageDirPath = path.resolve(process.cwd(), `../../${packageDirName}`);
      }

      (pkg.devDependencies as Record<string, string>)[dep] = this.installLocalPlugin
        ? `file:${packageDirPath}`
        : `~${latestMinor}`;
    });

    await writeFileTree(context, {
      "package.json": JSON.stringify(pkg, null, 2),
    });

    // init git repository before installing deps
    // so that cli-plugin-service can setup git hooks.
    const shouldInitGitFlag = shouldInitGit(options);
    if (shouldInitGitFlag) {
      spinner.stopSpinner();
      log();
      spinner.logWithSpinner(`🗄`, `Initializing git repository...`);
      await run("git init");
    }

    // install plugins
    spinner.stopSpinner();
    log();
    log(`⚙\u{fe0f}  Installing CLI plugins. This might take a while...`);
    await pkgManager.install();

    const resolvedPlugins = await this.resolvePlugins(cloneDeep(adaptedPreset.plugins));

    log();
    log(`🔩  Invoking plugin's generators...`);
    const generator = new Generator(context, { plugins: resolvedPlugins, pkg: pkg });
    await generator.generate();

    log();
    log(`📥  Installing additional dependencies...`);
    await pkgManager.install();

    log();
    spinner.logWithSpinner("📝", "Generating README.md...");
    await writeFileTree(context, {
      "README.md": generateReadme(generator.pkg, packageManager),
    });

    spinner.stopSpinner();
    log();
    spinner.logWithSpinner("🔧", "Fixing and formatting some lint errors...");
    try {
      await fixLintErrors(adaptedPreset);
    } catch (e) {
      log("\n");
      warn("🚨fix lint errors failure, you can manual fix it later by `npm run eslint:fix`");
    }

    spinner.stopSpinner();
    log();
    spinner.logWithSpinner("🎨", "Formatting some config file...");
    try {
      await formatConfigFiles(adaptedPreset);
    } catch (e) {
      log("\n");
      warn("🚨format file failure, but does not affect creating project");
    }

    spinner.stopSpinner();
    log();
    log(chalk.green("🌈  Create project successfully!"));

    log(`
      ${chalk.bgWhiteBright.black("🚀   Run Application  ")}
      ${chalk.yellow(`cd ${name}`)}
      ${chalk.yellow("npm start")}
    `);
    log();
    log(`🔗  More documentation to visit ${chalk.underline("https://luban.now.sh")}`);
    log();
    log(chalk.redBright("👩‍💻  Happy coding"));

    log();

    generator.printExitLogs();

    process.exit(1);
  }

  public run(command: string, args?: any): ExecaChildProcess {
    if (!args) {
      [command, ...args] = command.split(/\s+/);
    }
    return execa(command, args, { cwd: this.context });
  }

  public async formatConfigFiles(preset: Required<Preset>): Promise<void> {
    const { run } = this;

    const formatConfigJsFile = ["./babel.config.js"];
    const formatConfigJsonFiles = ["./.eslintrc", "./.postcssrc"];

    if (preset.stylelint) {
      formatConfigJsonFiles.push("./.stylelintrc ");
    }

    if (preset.language === "ts") {
      formatConfigJsonFiles.push("./tsconfig.json");
    }

    if (preset.unitTest) {
      formatConfigJsFile.push("./jest.config.js");
    }

    await run("./node_modules/prettier/bin-prettier.js", ["--write"].concat(formatConfigJsFile));
    await run(
      "./node_modules/prettier/bin-prettier.js",
      ["--parser=json", "--write"].concat(formatConfigJsonFiles),
    );
  }

  public async fixLintErrors(preset: Required<Preset>): Promise<void> {
    const { run } = this;

    const lintArgs = ["--config=.eslintrc", "--fix", "src/"];
    const formatArgs = ["--write", "src/**/*.{ts,tsx}"];

    if (preset.language === "ts") {
      lintArgs.push("--ext=.tsx,.ts");
      formatArgs.push("src/**/*.{ts,tsx}");
    }

    if (preset.language === "js") {
      lintArgs.push("--ext=.jsx,.js");
      formatArgs.push("src/**/*.{js,jsx}");
    }

    await run("./node_modules/eslint/bin/eslint.js", lintArgs);
    await run("./node_modules/prettier/bin-prettier.js", formatArgs);
  }

  public async promptAndResolvePreset(manual: boolean): Promise<Required<Preset>> {
    if (!manual) {
      return defaultPreset;
    }

    /**
     * @type FinallyAnswers
     */
    const answers = await inquirer.prompt(this.resolveFinalPrompts());

    const preset: Preset = {
      plugins: { "@luban-cli/cli-plugin-service": {} },
    };

    this.promptCompletedCallbacks.forEach((cb) => cb(answers as FinalAnswers, preset));

    return preset as Required<Preset>;
  }

  public async confirmUseDefaultPrest(): Promise<boolean> {
    const { useDefaultPreset } = await inquirer.prompt<{ useDefaultPreset: boolean }>([
      {
        type: "confirm",
        name: "useDefaultPreset",
        message: confirmUseDefaultPresetMsg,
        default: true,
      },
    ]);

    printDefaultPreset(defaultPreset);
    return useDefaultPreset;
  }

  public shouldInitGit(cliOptions: CliOptions): boolean {
    if (!hasGit()) {
      return false;
    }
    if (cliOptions.skipGit) {
      return false;
    }
    // --git
    if (cliOptions.forceGit) {
      return true;
    }

    if (typeof cliOptions.git === "string") {
      return true;
    }

    return !hasProjectGit(this.context);
  }

  public resolveFinalPrompts(): QuestionCollection {
    this.injectedPrompts.forEach((prompt: DistinctQuestion) => {
      const originalWhen = prompt.when || ((): boolean => true);
      // CHECK TYPE answer
      prompt.when = function(answers: any): boolean | Promise<boolean> {
        if (typeof originalWhen === "function") {
          return originalWhen(answers);
        }

        return originalWhen;
      };
    });

    return [...this.injectedPrompts, ...this.outroPrompts];
  }

  public resolveOutroPrompts(): ListQuestion[] {
    const outroPrompts: ListQuestion[] = [];

    return outroPrompts;
  }

  public async resolvePlugins(rawPlugins: RawPlugin): Promise<ResolvedPlugin[]> {
    const sortedRawPlugins = sortObject(rawPlugins, ["@luban-cli/cli-plugin-service"], true);
    const plugins: ResolvedPlugin[] = [];

    const pluginIDs = Object.keys(sortedRawPlugins);

    const loadPluginGeneratorWithWarn = (id: string, context: string): ApplyFn => {
      let generatorApply = loadModule(`${id}/dist/generator`, context);

      if (typeof generatorApply !== "function") {
        warn(
          `generator of plugin [${id}] not found while resolving plugin, use default generator function instead`,
        );
        generatorApply = (): void => undefined;
      }

      return generatorApply as ApplyFn;
    };

    for (const id of pluginIDs) {
      plugins.push({
        id: id as PLUGIN_ID,
        apply: loadPluginGeneratorWithWarn(id, this.context),
        options: sortedRawPlugins[id] || {},
      });
    }
    return plugins;
  }
}

export { Creator };
