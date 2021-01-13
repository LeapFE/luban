import inquirer, { Question, CheckboxQuestion } from "inquirer";
import chalk from "chalk";
import path from "path";
import cloneDeep from "lodash.clonedeep";

import { PackageManager } from "../../utils/packageManager";
import { PromptModuleAPI } from "./promptModuleAPI";
import { generateReadme } from "../../utils/getReadme";
import { getVersions } from "../../utils/getVersions";
import { printDefaultPreset } from "../../utils/printPreset";

import { Spinner, log, writeFileTree, warn } from "@luban-cli/cli-shared-utils";

import { Generator } from "../generator/generator";

import {
  CliOptions,
  Preset,
  PromptCompleteCallback,
  BasePkgFields,
  SUPPORTED_PACKAGE_MANAGER,
  FinalAnswers,
} from "../../definitions";
import { defaultPreset, confirmUseDefaultPresetMsg } from "../../constants";
import { BaseCreator } from "../baseCreator";

type FeaturePrompt = CheckboxQuestion<Array<{ name: string; value: unknown; short?: string }>>;

class Creator extends BaseCreator {
  private name: string;
  private readonly context: string;
  private options: CliOptions;
  public readonly featurePrompt: FeaturePrompt;
  public promptCompletedCallbacks: Array<PromptCompleteCallback>;
  public readonly injectedPrompts: Question<FinalAnswers>[];
  private _pkgManager: SUPPORTED_PACKAGE_MANAGER | undefined;
  private readonly installLocalPlugin: boolean;

  constructor(
    name: string,
    context: string,
    options: CliOptions,
    promptModules: Array<(api: PromptModuleAPI) => void>,
  ) {
    super();

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

    adaptedPreset.plugins["@luban-cli/cli-plugin-service"] = { projectName: name };

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
      ["__luban_config__"]: { projectName: name, ...adaptedPreset },
      engines: {
        node: ">=10",
      },
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
    const shouldInitGitFlag = shouldInitGit(options, this.context);
    if (shouldInitGitFlag) {
      spinner.stopSpinner();
      log();
      spinner.logWithSpinner(`🗄`, `Initializing git repository...`);
      await run(this.context, "git init");
    }

    // install plugins
    spinner.stopSpinner();
    log();
    log(`⚙\u{fe0f}  Installing CLI plugins. This might take a while...`);
    await pkgManager.install();

    const resolvedPlugins = await this.resolvePlugins(
      cloneDeep(adaptedPreset.plugins),
      this.context,
    );

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

    if (preset.commit) {
      formatConfigJsFile.push("./commitlint.config.js");
    }

    await run(
      this.context,
      "./node_modules/prettier/bin-prettier.js",
      ["--write"].concat(formatConfigJsFile),
    );
    await run(
      this.context,
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

    await run(this.context, "./node_modules/eslint/bin/eslint.js", lintArgs);
    await run(this.context, "./node_modules/prettier/bin-prettier.js", formatArgs);
  }

  public async promptAndResolvePreset(manual: boolean): Promise<Required<Preset>> {
    if (!manual) {
      return defaultPreset;
    }

    const answers = await inquirer.prompt<FinalAnswers>(this.injectedPrompts);

    const preset: Preset = {
      plugins: { "@luban-cli/cli-plugin-service": { projectName: "" } },
    };

    this.promptCompletedCallbacks.forEach((cb) => cb(answers, preset));

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
}

export { Creator };
