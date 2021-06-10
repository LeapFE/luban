"use strict";

const shell = require("shelljs");

const rawArgs = process.argv.slice(2);

const args = [...rawArgs, "--yes", "--conventional-commits", "--force-publish='*'"];

const versionCommand = `lerna version ${args.join(" ")}`;

const { code: versionCode } = shell.exec(versionCommand);
if (versionCode === 1) {
  console.error(`Failed: ${versionCommand}`);
  process.exit(1);
}
