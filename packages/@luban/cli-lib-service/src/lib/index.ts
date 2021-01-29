import minimist from "minimist";

const rawArgv: string[] = process.argv.slice(2);
const args = minimist(rawArgv);
const command = args._[0];

const builtInPluginsRelativePath = {
  build: "./../commands/build",
  publish: "./../commands/publish",
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
require(builtInPluginsRelativePath[command]).default(args, rawArgv);
