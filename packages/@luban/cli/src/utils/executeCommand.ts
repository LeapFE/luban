import execa from "execa";
import { EventEmitter } from "events";
import { log } from "@luban/cli-shared-utils";

class InstallProgress extends EventEmitter {
  private _progress: number;

  constructor() {
    super();

    this._progress = -1;
  }

  get progress(): number {
    return this._progress;
  }

  set progress(value) {
    this._progress = value;
  }

  get enabled(): boolean {
    return this._progress !== -1;
  }

  set enabled(value) {
    this.progress = value ? 0 : -1;
  }

  log(value: any): void {
    this.emit("log", value);
  }
}

const progress = new InstallProgress();
export const executeCommand = async function executeCommand(command: string, args: any[], cwd: string): Promise<void> {
  progress.enabled = false;

  try {
    await execa(command, args, {
      cwd,
      stdio: ["inherit", "inherit", "inherit"],
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
