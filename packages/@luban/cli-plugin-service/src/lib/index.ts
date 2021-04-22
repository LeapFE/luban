import minimist from "minimist";
import chokidar from "chokidar";
import { info, clearConsole } from "@luban-cli/cli-shared-utils";
import { fork } from "child_process";

import { Service } from "./Service";
import { produce } from "./produce";

const forkServePath = require.resolve("./forkServe.js");

const service = new Service(process.cwd());

const rawArgv: string[] = process.argv.slice(2);
const args = minimist(rawArgv);
const command = args._[0];

(async () => {
  try {
    switch (command) {
      case "produce":
        await produce();
        break;
      case "build":
      case "inspect":
        await service.run(command, args, rawArgv);
        break;
      case "serve":
        const mode = args.mode || "development";

        let serve = fork(forkServePath, process.argv);

        ["SIGINT", "SIGTERM"].forEach((signal) => {
          process.on(signal, () => {
            serve.kill(signal as NodeJS.Signals);
            process.exit();
          });
        });

        const watcher = chokidar.watch([
          `${process.cwd()}/.env`,
          `${process.cwd()}/.env.${mode}*`,
          `${process.cwd()}/src/index.tsx`,
          `${process.cwd()}/src/route.ts`,
          `${process.cwd()}/luban.config.ts`,
        ]);

        watcher.on("change", (filepath) => {
          clearConsole();

          info(filepath + " was changed");

          console.log();
          info("Try to restart server...");

          serve.kill();
          serve = fork(forkServePath, process.argv);
        });
        break;
      default:
        await service.run("help", args, rawArgv);
        break;
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
