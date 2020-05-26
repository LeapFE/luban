"use strict";

const shell = require("shelljs");

if (!shell.exec("npm config get registry").stdout.includes("https://registry.npmjs.org/")) {
  console.error("Failed: set npm registry to https://registry.npmjs.org/ first");
  process.exit(1);
}

const ret = shell.exec("./node_modules/.bin/lerna updated").stdout;
const updatedRepos = ret
  .split("\n")
  .map((line) => line.replace("- ", ""))
  .filter((line) => line !== "");

if (updatedRepos.length === 0) {
  console.log("No package is updated.");
  process.exit(0);
}

const { code: versionCode } = shell.exec("lerna version --exact --yes --conventional-commits");
if (versionCode === 1) {
  console.error("Failed: lerna version --exact --yes --conventional-commits");
  process.exit(1);
}

const { code: publishCode } = shell.exec("lerna publish from-git --yes");
if (publishCode === 1) {
  console.error("Failed: lerna publish from-git --yes");
  process.exit(1);
}
