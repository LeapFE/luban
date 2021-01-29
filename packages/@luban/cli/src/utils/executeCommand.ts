import execa from "execa";
import { log } from "@luban-cli/cli-shared-utils";

export const executeCommand = async function executeCommand(
  command: string,
  args: string[],
  cwd: string,
): Promise<void> {
  if (process.env.__DEBUG__) {
    log(args.join(" "), `execute command: ${command}`);
  }

  try {
    await execa(command, args, {
      cwd,
      stdio: command === "npm" ? ["ignore", "ignore", "inherit"] : "inherit",
    }).on("close", (code: number) => {
      if (code !== 0) {
        log(`command failed: ${command} ${args.join(" ")}`);
        return;
      }
    });
  } catch (error) {
    log(`command failed: ${command} ${args.join(" ")}`);
  }
};
