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

import {
  logWithSpinner,
  stopSpinner,
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

    this.injectedPrompts = [];
    this.promptCompletedCallbacks = [];
    this.outroPrompts = this.resolveOutroPrompts();

    const promptAPI = new PromptModuleAPI(this);
    promptModules.forEach((m) => m(promptAPI));
  }

  public async create(): Promise<void> {
    const { options, context, name, shouldInitGit, run, formatConfigFiles } = this;

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

    logWithSpinner(`✨`, `Creating project in ${chalk.yellow(context)}.`);
    log();

    const { latestMinor } = await getVersions();

    const pkg: BasePkgFields = {
      name,
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
      logWithSpinner(`🗃`, `Initializing git repository...`);
      await run("git init");
    }
    log();

    // install plugins
    stopSpinner();
    log(`⚙\u{fe0f}  Installing CLI plugins. This might take a while...`);
    log();
    await pkgManager.install();

    log();

    const resolvedPlugins = await this.resolvePlugins(cloneDeep(adaptedPreset.plugins));

    log(`🚀  Invoking plugin's generators...`);
    const generator = new Generator(context, { plugins: resolvedPlugins, pkg: pkg });
    await generator.generate();

    log();

    stopSpinner();

    log(`📦   Installing additional dependencies...`);
    await pkgManager.install();

    log();

    stopSpinner();
    logWithSpinner("📄   Generating README.md...");
    await writeFileTree(context, {
      "README.md": generateReadme(generator.pkg, packageManager),
    });

    log();
    log();

    stopSpinner();
    log("🎨  formatting some file...");
    try {
      await formatConfigFiles(adaptedPreset);
    } catch (e) {
      warn("format file failure, but does not effect to create project");
    }

    log();

    log(chalk.green("🎉   create project successfully!"));

    log(`
      ${chalk.bgWhiteBright.black("🚀   Run Application  ")}
      ${chalk.yellow(`cd ${name}`)}
      ${chalk.yellow("npm start")}
    `);
    log();
    log(
      `🔗  More documentation to visit ${chalk.underline(
        `${require("./../../package.json").homepage}`,
      )}`,
    );
    log();
    log(chalk.redBright("💻   Happy coding"));

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

  public printDefaultPreset(): void {
    log();
    log("List default prest");
    Object.keys(defaultPreset).forEach((key: string) => {
      if (key === "plugins" || key === "configs") {
        return;
      }
      log(`  ${chalk.green(key)}: ${chalk.yellowBright(defaultPreset[key])}`);
    });
    log();
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

    this.printDefaultPreset();
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

    return hasProjectGit(this.context);
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

    for (const id of pluginIDs) {
      const apply = loadModule(`${id}/dist/generator`, this.context) || ((): void => undefined);
      plugins.push({ id: id as PLUGIN_ID, apply, options: sortedRawPlugins[id] || {} });
    }
    return plugins;
  }
}

export { Creator };
