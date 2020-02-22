import chalk from "chalk";

import { PluginAPI } from "./../lib/PluginAPI";
import { builtinServiceCommandName, CommandList } from "./../definitions";

function getPadLength(obj: Record<string, any>): number {
  let longest = 10;
  for (const name in obj) {
    if (name.length + 1 > longest) {
      longest = name.length + 1;
    }
  }
  return longest;
}

function logMainHelp(api: PluginAPI): void {
  console.log(`\n  Usage: luban-cli-service <command> [options]\n` + `\n  Commands:\n`);
  const commands = api.service.commands;
  const padLength = getPadLength(commands);
  for (const name in commands) {
    if (name !== "help") {
      const opts = commands[name].opts || {};
      console.log(`    ${chalk.blue(name.padEnd(padLength))}${opts.description || ""}`);
    }
  }
  console.log(
    `\n  run ${chalk.green(`luban-cli-service help [command]`)} for usage of a specific command.\n`,
  );
}

function logHelpForCommand(
  name: builtinServiceCommandName,
  command?: CommandList<null>[builtinServiceCommandName],
): void {
  if (!command) {
    console.log(chalk.red(`\n  command "${name}" unregistered.`));
  } else {
    const opts = command.opts || {};
    if (opts.usage) {
      console.log(`\n  Usage: ${opts.usage}`);
    }
    if (opts.options) {
      console.log(`\n  Options:\n`);
      const padLength = getPadLength(opts.options);
      for (const [flags, description] of Object.entries(opts.options)) {
        console.log(`    ${chalk.blue(flags.padEnd(padLength))}${description}`);
      }
    }
    if (opts.details) {
      console.log();
      console.log(
        opts.details
          .split("\n")
          .map((line: string) => `  ${line}`)
          .join("\n"),
      );
    }
    console.log();
  }
}

export default function(api: PluginAPI): void {
  api.registerCommand("help", (args) => {
    const commandName = args._[0] as builtinServiceCommandName;
    if (!commandName) {
      logMainHelp(api);
    } else {
      logHelpForCommand(commandName, (api.service.commands as CommandList<null>)[commandName]);
    }
  });
}
