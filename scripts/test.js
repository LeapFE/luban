"use strict";

const minimist = require("minimist");

const { getChangedPackages, exit } = require("./utils");
const { organizationName } = require("./constant");

const rawArgs = process.argv.slice(2);
const args = minimist(rawArgs);

let regex = `.*@${organizationName}/.*/.*\\.test\\.ts$`;

// node scripts/build.js --package=cli,cli-shared-utils
// node scripts/build.js --package=cli
if (args.package) {
  const packages = (args.p || args.package).split(",").join("|");
  regex = `.*@${organizationName}/(${packages}|cli-(plugin|lib)-(${packages}))/.*\\.test\\.ts$`;
  const i = rawArgs.indexOf("-p");
  rawArgs.splice(i, 2);
}

// node scripts/test.js --onlyChanged
if (args.onlyChanged) {
  const changePackages = getChangedPackages().join("|");

  if (changePackages.length === 0) {
    console.log("There is no changed package to test, exiting with code 0");
    exit(0);
  }

  regex = `.*@${organizationName}/(${changePackages}|cli-(plugin|lib)-(${changePackages}))/.*\\.test\\.ts$`;
}

const jestArgs = [
  "--env",
  "node",
  "--runInBand",
  "--detectOpenHandles",
  "--passWithNoTests",
  ...rawArgs,
  ...(regex ? [regex] : []),
];

console.log(`running jest with args: ${jestArgs.join(" ")}`);

require("jest").run(jestArgs);
