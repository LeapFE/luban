process.env.NODE_PATH = __dirname + "../node_modules";

import { Command, Option } from "commander";
import chalk from "chalk";
import envinfo from "envinfo";
import didYouMean from "didyoumean";
import minimist from "minimist";

didYouMean.threshold = 0.6;

import { enhanceErrorMessages } from "./utils/enhanceErrorMessages";
import { CliOptions } from "./definitions";
import { init } from "./lib/create";

const program = new Command();

function suggestCommands(unknownCommand: string): void {
  const availableCommands = program.commands.map((cmd) => {
    return cmd._name as string;
  });

  const suggestion: string | string[] = didYouMean(unknownCommand, availableCommands);
  if (suggestion && !Array.isArray(suggestion)) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`));
  }
}

function camelize(str: string): string {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
}

function prepareInitOptions(cmd: Command): CliOptions {
  const args = {};

  (cmd.options as Array<Option>).forEach((o) => {
    const key = camelize(o.long.replace(/^--/, ""));
    if (typeof cmd[key] !== "function" && typeof cmd[key] !== "undefined") {
      args[key] = cmd[key];
    }
  });

  return args;
}

program
  .version(`@luban-cli/cli ${require("../package.json").version}`)
  .usage("<command> [options]");

program
  .command("init <project>")
  .description("init a new project")
  .option(
    "-r, --registry <url>",
    "Use specified npm registry when installing dependencies (only for npm)",
  )
  .option("-s, --skipGit", "Skip git initialization")
  .option("-g, --git [message]", "Force git initialization with initial commit message")
  .option("-f, --force", "Overwrite target directory if it exists")
  .option("-l, --localPlugin", "Install local plugins while create project for test or debug")
  .option("-m, --manual", "Manual select features while create project")
  .action((project: string, cmd: Command) => {
    if (project.replace(/^\s+|\s+$/g, "") === "") {
      const programName = `${cmd.parent._name} ${cmd._name}`;

      console.error("Please specify the project directory:");
      console.log(`  ${chalk.cyan(programName)} ${chalk.green("<project>")}`);
      console.log();
      console.log("For example:");
      console.log(`  ${chalk.cyan(programName)} ${chalk.green("my-react-app")}`);
      console.log();
      console.log(`Run ${chalk.cyan(`${programName} --help`)} to see all options.`);
      process.exit(1);
    }

    const options = prepareInitOptions(cmd);

    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(
        chalk.yellow(
          "\n Info: You provided more than one argument. The first one will be used as the app's name, the rest are ignored.",
        ),
      );
    }

    // should force invoke `git init` when specified `--git [message]` option
    if (process.argv.includes("-g") || process.argv.includes("--git")) {
      options.forceGit = true;
    }

    // will install and invoke local plugin when specified `--localPlugin` option
    if (process.argv.includes("-l") || process.argv.includes("--localPlugin")) {
      process.env.USE_LOCAL_PLUGIN = "true";
    }

    init(project, options);
  });

program
  .command("info")
  .description("print debugging information about your environment")
  .action(() => {
    console.log(chalk.bold("\nEnvironment Info:"));
    envinfo
      .run(
        {
          System: ["OS", "CPU"],
          Binaries: ["Node", "npm"],
          Browsers: ["Chrome", "Edge", "Firefox", "Safari"],
          npmPackages: ["typescript", "react", "react-dom"],
          npmGlobalPackages: ["luban-react-cli"],
        },
        {
          showNotFound: true,
          duplicates: true,
          fullTree: true,
        },
      )
      .then(console.log);
  });

program.arguments("<command>").action((cmd) => {
  program.outputHelp();
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
  console.log();
  suggestCommands(cmd);
});

program.on("--help", () => {
  console.log();
  console.log(`  Only ${chalk.green("<project-directory>")} is required.`);
  console.log();
});

enhanceErrorMessages("missingArgument", (argName: string) => {
  return `Missing required argument ${chalk.yellow(`<${argName}>`)}.`;
});

enhanceErrorMessages("unknownOption", (optionName: string) => {
  return `Unknown option ${chalk.yellow(optionName)}.`;
});

enhanceErrorMessages("optionMissingArgument", (option: Option, flag: string) => {
  return (
    `Missing required argument for option ${chalk.yellow(option.flags)}` +
    (flag ? `, got ${chalk.yellow(flag)}` : ``)
  );
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
