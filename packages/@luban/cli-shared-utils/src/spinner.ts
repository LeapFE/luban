import ora, { Ora } from "ora";
import chalk from "chalk";

class Spinner {
  private spinner: Ora;
  private lastMsg: { symbol?: string; text?: string } | null;
  private isPaused: boolean;

  constructor() {
    this.spinner = ora();
    this.lastMsg = null;
    this.isPaused = false;
  }

  public logWithSpinner(symbol: string, msg?: string): void {
    let adaptedMsg = msg;
    let adaptedSymbol = symbol;

    if (!msg) {
      adaptedMsg = symbol;
      adaptedSymbol = chalk.green("✔");
    }
    if (this.lastMsg) {
      this.spinner.stopAndPersist({
        symbol: this.lastMsg.symbol,
        text: this.lastMsg.text,
      });
    }
    this.spinner.text = " " + adaptedMsg;
    this.lastMsg = {
      symbol: adaptedSymbol + " ",
      text: adaptedMsg,
    };

    this.spinner.start();
  }

  public stopSpinner(persist?: boolean): void {
    if (this.lastMsg && !persist) {
      this.spinner.stopAndPersist({
        symbol: this.lastMsg.symbol,
        text: this.lastMsg.text,
      });
    } else {
      this.spinner.stop();
    }
    this.lastMsg = null;
  }

  public pauseSpinner(): void {
    if (this.spinner.isSpinning) {
      this.spinner.stop();
      this.isPaused = true;
    }
  }

  public resumeSpinner(): void {
    if (this.isPaused) {
      this.spinner.start();
      this.isPaused = false;
    }
  }

  public failSpinner(text?: string): void {
    this.spinner.fail(text);
  }
}

export { Spinner };
