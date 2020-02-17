"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
const chalk_1 = __importDefault(require("chalk"));
const spinner = ora_1.default();
let lastMsg = null;
let isPaused = false;
exports.logWithSpinner = function (symbol, msg) {
    let adaptedMsg = msg;
    let adaptedSymbol = symbol;
    if (!msg) {
        adaptedMsg = symbol;
        adaptedSymbol = chalk_1.default.green("✔");
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
exports.stopSpinner = function (persist) {
    if (lastMsg && persist) {
        spinner.stopAndPersist({
            symbol: lastMsg.symbol,
            text: lastMsg.text,
        });
    }
    else {
        spinner.stop();
    }
    lastMsg = null;
};
exports.pauseSpinner = function () {
    if (spinner.isSpinning) {
        spinner.stop();
        isPaused = true;
    }
};
exports.resumeSpinner = function () {
    if (isPaused) {
        spinner.start();
        isPaused = false;
    }
};
exports.failSpinner = function (text) {
    spinner.fail(text);
};
