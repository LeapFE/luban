import ora from "ora";
import chalk from "chalk";

const spinner = ora();
let lastMsg: { symbol?: string; text?: string } | null = null;
let isPaused = false;

export const logWithSpinner = function(symbol: string, msg?: string): void {
  let adaptedMsg = msg;
  let adaptedSymbol = symbol;

  if (!msg) {
    adaptedMsg = symbol;
    adaptedSymbol = chalk.green("✔");
  }
  if (lastMsg) {
    spinner.stopAndPersist({
      symbol: lastMsg.symbol,
      text: lastMsg.text,
    });
  }
  spinner.text = " " + adaptedMsg;
  lastMsg = {
    symbol: adaptedSymbol + " ",
    text: adaptedMsg,
  };
  spinner.start();
};

/**
 * @param {boolean} persist
 */
export const stopSpinner = function(persist?: boolean): void {
  if (lastMsg && persist) {
    spinner.stopAndPersist({
      symbol: lastMsg.symbol,
      text: lastMsg.text,
    });
  } else {
    spinner.stop();
  }
  lastMsg = null;
};

export const pauseSpinner = function(): void {
  if (spinner.isSpinning) {
    spinner.stop();
    isPaused = true;
  }
};

export const resumeSpinner = function(): void {
  if (isPaused) {
    spinner.start();
    isPaused = false;
  }
};

export const failSpinner = function(text?: string): void {
  spinner.fail(text);
};
