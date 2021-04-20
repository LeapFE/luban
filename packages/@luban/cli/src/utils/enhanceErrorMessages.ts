import program from "commander";
import chalk from "chalk";

function enhanceErrorMessages<T, K>(methodName: string, log: (arg1: T, arg2: K) => string): void {
  program.Command.prototype[methodName] = function(arg1: T, arg2: K): void {
    if (methodName === "unknownOption" && this._allowUnknownOption) {
      return;
    }
    this.outputHelp();
    console.log(`  ` + chalk.red(log(arg1, arg2)));
    console.log();
    process.exit(1);
  };
}

export { enhanceErrorMessages };
