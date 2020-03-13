"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
const chalk_1 = __importDefault(require("chalk"));
class Spinner {
    constructor() {
        this.spinner = ora_1.default();
        this.lastMsg = null;
        this.isPaused = false;
    }
    logWithSpinner(symbol, msg) {
        let adaptedMsg = msg;
        let adaptedSymbol = symbol;
        if (!msg) {
            adaptedMsg = symbol;
            adaptedSymbol = chalk_1.default.green("✔");
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
    stopSpinner(persist) {
        if (this.lastMsg && !persist) {
            this.spinner.stopAndPersist({
                symbol: this.lastMsg.symbol,
                text: this.lastMsg.text,
            });
        }
        else {
            this.spinner.stop();
        }
        this.lastMsg = null;
    }
    pauseSpinner() {
        if (this.spinner.isSpinning) {
            this.spinner.stop();
            this.isPaused = true;
        }
    }
    resumeSpinner() {
        if (this.isPaused) {
            this.spinner.start();
            this.isPaused = false;
        }
    }
    failSpinner(text) {
        this.spinner.fail(text);
    }
}
exports.Spinner = Spinner;
