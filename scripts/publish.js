"use strict";

const shell = require("shelljs");
const minimist = require("minimist");

const rawArgs = process.argv.slice(2);
const args = minimist(rawArgs);

if (!shell.exec("npm config get registry").stdout.includes("https://registry.npmjs.org/")) {
  console.error("Failed: set npm registry to https://registry.npmjs.org/ first");
  process.exit(1);
}

const publishCommand = `lerna publish from-git --yes --dist-tag ${args.tag}`;

const { code: publishCode } = shell.exec(publishCommand);
if (publishCode === 1) {
  console.error(`Failed: ${publishCommand}`);
  process.exit(1);
}
