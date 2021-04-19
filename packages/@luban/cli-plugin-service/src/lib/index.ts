import minimist from "minimist";

import { Service } from "./Service";
import { produce } from "./produce";

import { builtinServiceCommandName } from "../definitions";

const service = new Service(process.cwd());

const rawArgv: string[] = process.argv.slice(2);
const args = minimist(rawArgv);
const command = args._[0];

if (command === "produce") {
  produce().catch((err: Error) => {
    console.error(err);
    process.exit(1);
  });
} else {
  service.run(command as builtinServiceCommandName, args, rawArgv).catch((err: Error) => {
    console.error(err);
    process.exit(1);
  });
}
