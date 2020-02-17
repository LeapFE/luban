import chalk from "chalk";
import readline from "readline";
import { EventEmitter } from "events";

const events = new EventEmitter();

function _log(type: string, tag: string, message: string): void {
  if (process.env.LUBAN_CLI_API_MODE && message) {
    events.emit("log", {
      message,
      type,
      tag,
    });
  }
}

function format(label: string, msg: string): string {
  return msg
    .split("\n")
    .map((line, i) => {
      return i === 0 ? `${label} ${line}` : line.padStart(chalk.reset(label).length);
    })
    .join("\n");
}

function chalkTag(msg: string): string {
  return chalk.bgBlackBright.white.dim(` ${msg} `);
}

export function log(msg: string = "", tag: string = ""): void {
  tag ? console.log(format(chalkTag(tag), msg)) : console.log(msg);
  _log("log", tag, msg);
}

export function info(msg: string, tag: string = ""): void {
  console.log(format(chalk.bgBlue.black(" INFO ") + (tag ? chalkTag(tag) : ""), msg));
  _log("info", tag, msg);
}

export function done(msg: string, tag: string = ""): void {
  console.log(format(chalk.bgGreen.black(" DONE ") + (tag ? chalkTag(tag) : ""), msg));
  _log("done", tag, msg);
}

export function warn(msg: string, tag: string = ""): void {
  console.warn(
    format(chalk.bgYellow.black(" WARN ") + (tag ? chalkTag(tag) : ""), chalk.yellow(msg)),
  );
  _log("warn", tag, msg);
}

export function error(msg: string | Error, tag: string = ""): void {
  if (typeof msg === "string") {
    console.error(format(chalk.bgRed(" ERROR ") + (tag ? chalkTag(tag) : ""), chalk.red(msg)));
    _log("error", tag, msg);
  }

  if (msg instanceof Error) {
    console.error(msg.stack);
    _log("error", tag, msg.stack || "");
  }
}

export function clearConsole(title?: string): void {
  if (process.stdout.isTTY) {
    const blank = "\n".repeat(process.stdout.rows);
    console.log(blank);
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
    if (title) {
      console.log(title);
    }
  }
}
