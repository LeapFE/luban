import path from "path";
import inquirer, { Question } from "inquirer";
import cloneDeep from "lodash.clonedeep";
import execa, { ExecaChildProcess } from "execa";
import {
  Spinner,
  log,
  writeFileTree,
  hasGit,
  hasProjectGit,
  loadModule,
  warn,
} from "@luban-cli/cli-shared-utils";
import chalk from "chalk";

import {
  CreateLibFinalAnswers,
  CreateLibPromptCompleteCallback,
  CreateLibPreset,
  CliOptions,
  BasePkgFields,
  ResolvedPlugin,
  ApplyFn,
  PLUGIN_ID,
} from "../../definitions";
import { LibPromptModuleAPI } from "./promptModuleAPI";
import { PackageManager } from "../../utils/packageManager";
import { getVersions } from "../../utils/getVersions";
import { CreateLibRawPlugin } from "@luban-cli/cli-shared-types/dist/shared";
import { sortObject } from "../../utils/sortObject";
import { generateReadme } from "../../utils/getReadme";
import { Generator } from "../generator/generator";

class LibCreator {
  public promptCompletedCallbacks: Array<CreateLibPromptCompleteCallback>;
  public readonly injectedPrompts: Question<CreateLibFinalAnswers>[];

  private name: string;
  private context: string;
  private options: CliOptions;

  private installLocalPlugin: boolean;

  constructor(
    name: string,
    context: string,
    options: CliOptions,
    promptModules: Array<(api: LibPromptModuleAPI) => void>,
  ) {
    this.context = context;
    this.name = name;
    this.options = options;

    this.injectedPrompts = [];
    this.promptCompletedCallbacks = [];

    this.installLocalPlugin = options.localPlugin || false;

    const libPromptModuleAPI = new LibPromptModuleAPI(this);
    promptModules.forEach((m) => m(libPromptModuleAPI));
  }

  public async create(): Promise<void> {
    const preset = await this.promptAndResolvePreset();

    const adaptedPreset = cloneDeep(preset);

    adaptedPreset.plugins["@luban-cli/cli-lib-service"] = { projectName: this.name };

    const pkgManager = new PackageManager({ context: this.context, forcePackageManager: "npm" });

    const spinner = new Spinner();

    log();
    spinner.logWithSpinner(`🏗`, `Creating project in ${chalk.yellow(this.context)}`);

    const { latestMinor } = await getVersions();

    const pkg: BasePkgFields = {
      name: this.name,
      description: "A react library",
      version: "0.0.1",
      private: true,
      devDependencies: {},
      ["__luban_config__"]: { projectName: this.name, ...adaptedPreset },
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

    await writeFileTree(this.context, {
      "package.json": JSON.stringify(pkg, null, 2),
    });

    // init git repository before installing deps
    // so that cli-plugin-service can setup git hooks.
    const shouldInitGitFlag = this.shouldInitGit(this.options);
    if (shouldInitGitFlag) {
      spinner.stopSpinner();
      log();
      spinner.logWithSpinner(`🗄`, `Initializing git repository...`);
      await this.run("git init");
    }

    // install plugins
    spinner.stopSpinner();
    log();
    log(`⚙\u{fe0f}  Installing CLI plugins. This might take a while...`);
    await pkgManager.install();

    const resolvedPlugins = await this.resolvePlugins(cloneDeep(adaptedPreset.plugins));

    log();
    log(`🔩  Invoking plugin's generators...`);
    const generator = new Generator(this.context, { plugins: resolvedPlugins, pkg: pkg });
    await generator.generate();

    log();
    log(`📥  Installing additional dependencies...`);
    await pkgManager.install();

    log();
    spinner.logWithSpinner("📝", "Generating README.md...");
    await writeFileTree(this.context, {
      "README.md": generateReadme(generator.pkg, "npm"),
    });

    spinner.stopSpinner();
    log();
    spinner.logWithSpinner("🔧", "Fixing and formatting some lint errors...");
    try {
      await this.fixLintErrors();
    } catch (e) {
      log("\n");
      warn("🚨fix lint errors failure, you can manual fix it later by `npm run eslint:fix`");
    }

    spinner.stopSpinner();
    log();
    spinner.logWithSpinner("🎨", "Formatting some config file...");
    try {
      await this.formatConfigFiles(adaptedPreset);
    } catch (e) {
      log("\n");
      warn("🚨format file failure, but does not affect creating project");
    }

    spinner.stopSpinner();
    log();
    log(chalk.green("🌈  Create project successfully!"));

    log();
    log(`🔗  More documentation to visit ${chalk.underline("https://luban.now.sh")}`);
    log();
    log(chalk.redBright("👩‍💻  Happy coding"));

    log();

    generator.printExitLogs();

    process.exit(1);
  }

  public async formatConfigFiles(preset: Required<CreateLibPreset>): Promise<void> {
    const formatConfigJsFile = ["./jest.config.js"];
    const formatConfigJsonFiles = ["./.eslintrc", "./tsconfig.json"];

    if (preset.stylelint) {
      formatConfigJsonFiles.push("./.stylelintrc ");
    }

    if (preset.commit) {
      formatConfigJsFile.push("./commitlint.config.js");
    }

    await this.run(
      "./node_modules/prettier/bin-prettier.js",
      ["--write"].concat(formatConfigJsFile),
    );
    await this.run(
      "./node_modules/prettier/bin-prettier.js",
      ["--parser=json", "--write"].concat(formatConfigJsonFiles),
    );
  }

  public async fixLintErrors(): Promise<void> {
    const lintArgs = ["--config=.eslintrc", "--fix", "src/", "--ext=.tsx,.ts"];
    const formatArgs = ["--write", "src/**/*.{ts,tsx}", "src/**/*.{ts,tsx}"];

    await this.run("./node_modules/eslint/bin/eslint.js", lintArgs);
    await this.run("./node_modules/prettier/bin-prettier.js", formatArgs);
  }

  // REVIEW repeated with `webAppCreator.run`
  public run(command: string, args?: string[]): ExecaChildProcess {
    if (!args) {
      [command, ...args] = command.split(/\s+/);
    }
    return execa(command, args, { cwd: this.context });
  }

  public async promptAndResolvePreset(): Promise<Required<CreateLibPreset>> {
    const answers = await inquirer.prompt<CreateLibFinalAnswers>(this.injectedPrompts);

    const preset: CreateLibPreset = {
      plugins: {
        "@luban-cli/cli-lib-service": { projectName: "" },
        "@luban-cli/cli-plugin-eslint": {},
        "@luban-cli/cli-plugin-unit-test": {},
      },
    };

    this.promptCompletedCallbacks.forEach((cb) => cb(answers, preset));

    return preset as Required<CreateLibPreset>;
  }

  // REVIEW repeated with `webAppCreator.shouldInitGit`
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

  // REVIEW repeated with `webAppCreator.resolvePlugins`
  public async resolvePlugins(rawPlugins: CreateLibRawPlugin): Promise<ResolvedPlugin[]> {
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

export { LibCreator };
