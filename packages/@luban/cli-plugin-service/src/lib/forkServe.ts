import minimist from "minimist";

import { Service } from "./Service";
import { error } from "@luban-cli/cli-shared-utils";

(async function() {
  const rawArgv = process.argv.slice(2);
  const args = minimist(rawArgv);

  try {
    const service = new Service(process.cwd());

    await service.run("serve", args, rawArgv);

    ["SIGINT", "SIGTERM"].forEach((signal) => {
      process.on(signal, () => {
        process.exit();
      });
    });
  } catch (err) {
    error(err);
    process.exit();
  }
})();
