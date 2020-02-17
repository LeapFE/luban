import program from "commander";
import chalk from "chalk";

function enhanceErrorMessages(methodName: string, log: (...args: any[]) => string): void {
  program.Command.prototype[methodName] = function(...args: any[]): void {
    if (methodName === "unknownOption" && this._allowUnknownOption) {
      return;
    }
    this.outputHelp();
    console.log(`  ` + chalk.red(log(...args)));
    console.log();
    process.exit(1);
  };
}

export { enhanceErrorMessages };
