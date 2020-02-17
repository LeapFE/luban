"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const readline_1 = __importDefault(require("readline"));
const events_1 = require("events");
const events = new events_1.EventEmitter();
function _log(type, tag, message) {
    if (process.env.LUBAN_CLI_API_MODE && message) {
        events.emit("log", {
            message,
            type,
            tag,
        });
    }
}
function format(label, msg) {
    return msg
        .split("\n")
        .map((line, i) => {
        return i === 0 ? `${label} ${line}` : line.padStart(chalk_1.default.reset(label).length);
    })
        .join("\n");
}
function chalkTag(msg) {
    return chalk_1.default.bgBlackBright.white.dim(` ${msg} `);
}
function log(msg = "", tag = "") {
    tag ? console.log(format(chalkTag(tag), msg)) : console.log(msg);
    _log("log", tag, msg);
}
exports.log = log;
function info(msg, tag = "") {
    console.log(format(chalk_1.default.bgBlue.black(" INFO ") + (tag ? chalkTag(tag) : ""), msg));
    _log("info", tag, msg);
}
exports.info = info;
function done(msg, tag = "") {
    console.log(format(chalk_1.default.bgGreen.black(" DONE ") + (tag ? chalkTag(tag) : ""), msg));
    _log("done", tag, msg);
}
exports.done = done;
function warn(msg, tag = "") {
    console.warn(format(chalk_1.default.bgYellow.black(" WARN ") + (tag ? chalkTag(tag) : ""), chalk_1.default.yellow(msg)));
    _log("warn", tag, msg);
}
exports.warn = warn;
function error(msg, tag = "") {
    if (typeof msg === "string") {
        console.error(format(chalk_1.default.bgRed(" ERROR ") + (tag ? chalkTag(tag) : ""), chalk_1.default.red(msg)));
        _log("error", tag, msg);
    }
    if (msg instanceof Error) {
        console.error(msg.stack);
        _log("error", tag, msg.stack || "");
    }
}
exports.error = error;
function clearConsole(title) {
    if (process.stdout.isTTY) {
        const blank = "\n".repeat(process.stdout.rows);
        console.log(blank);
        readline_1.default.cursorTo(process.stdout, 0, 0);
        readline_1.default.clearScreenDown(process.stdout);
        if (title) {
            console.log(title);
        }
    }
}
exports.clearConsole = clearConsole;
