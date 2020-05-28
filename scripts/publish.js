"use strict";

const shell = require("shelljs");

if (!shell.exec("npm config get registry").stdout.includes("https://registry.npmjs.org/")) {
  console.error("Failed: set npm registry to https://registry.npmjs.org/ first");
  process.exit(1);
}

const { code: publishCode } = shell.exec("lerna publish from-git --yes");
if (publishCode === 1) {
  console.error("Failed: lerna publish from-git --yes");
  process.exit(1);
}
