import chalk from "chalk";

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

export function log(msg: string = "", tag: string = "Server Side rendering"): void {
  tag ? console.log(format(chalkTag(tag), msg)) : console.log(msg);
}

export function info(msg: string, tag: string = "Server Side rendering"): void {
  console.log(format(chalk.bgBlue.black(" INFO ") + (tag ? chalkTag(tag) : ""), msg));
}

export function warn(msg: string, tag: string = "Server Side rendering"): void {
  console.warn(
    format(chalk.bgYellow.black(" WARN ") + (tag ? chalkTag(tag) : ""), chalk.yellow(msg)),
  );
}
