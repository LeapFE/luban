import run from "togo-np";
import { error } from "@luban-cli/cli-shared-utils";

import { CliOptions } from "togo-np/lib/definitions";

import minimist from "minimist";

export default async function publish(_: minimist.ParsedArgs, rawArgv: string[]) {
  const argv = minimist(rawArgv, {
    alias: { "run-scripts": "runScripts", "allow-any-branch": "allowAnyBranch" },
  });

  try {
    await run(argv._[1], argv as CliOptions);
  } catch (err) {
    error(err.message);
    process.exit(1);
  }
}
