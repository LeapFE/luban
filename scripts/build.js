"use strict";

const shell = require("shelljs");
const minimist = require("minimist");

const { getChangedPackages, exit } = require("./utils");
const { organizationName } = require("./constant");

const rawArgs = process.argv.slice(2);
const args = minimist(rawArgs);

const buildArgs = ["build", "--stream", "--sort"];

// node scripts/build.js --check
if (args.check) {
  buildArgs.shift();
  buildArgs.unshift("check:type");
}

// node scripts/build.js --package=cli,cli-shared-utils
if (args.package) {
  const specifyPackages = args.package
    .split(",")
    .map((packageName) => `--scope=@${organizationName}/${packageName}`)
    .join(" ");

  buildArgs.push(specifyPackages);
}

// node scripts/build.js --onlyChanged
if (args.onlyChanged) {
  const changePackages = getChangedPackages()
    .map((packageName) => `--scope=@${organizationName}/${packageName}`)
    .join(" ");

  if (changePackages.length === 0) {
    console.log("There is no changed package to build, exiting with code 0");
    exit(0);
  }

  if (changePackages.length > 0) {
    buildArgs.push(changePackages);
  }
}

const buildCommand = `lerna run ${buildArgs.join(" ")}`;
console.log(`running build command: ${buildCommand}`);
const { code: buildCode } = shell.exec(buildCommand);
if (buildCode === 1) {
  console.log(`Failed: ${buildCommand}`);
  process.exit(1);
}
