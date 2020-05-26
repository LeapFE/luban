"use strict";

const shell = require("shelljs");
const minimist = require("minimist");

const { getChangedPackages, exit } = require("./utils");
const { organizationName, PACKAGE_WEIGHT_LIST } = require("./constant");

const rawArgs = process.argv.slice(2);
const args = minimist(rawArgs);

let scope = [];

// node scripts/build.js --package=cli,cli-shared-utils
if (args.package) {
  scope = args.package.split(",");
}

// node scripts/build.js --onlyChanged
if (args.onlyChanged) {
  const changePackages = getChangedPackages();
  scope = changePackages;

  if (changePackages.length === 0) {
    console.log("There is no changed package to build, exiting with code 0");
    exit(0);
  }
}

/**
 *
 * @param {string[]} packages
 * @returns {string[]}
 */
function getFinalScope(packages) {
  let finalScope = packages;

  if (packages.length === 0) {
    const { stdout } = shell.exec("lerna list --all");
    finalScope = stdout
      .split("\n")
      .map((name) => name.replace(`@${organizationName}/`, ""))
      .filter((n) => !!n);
  }

  if (!finalScope.includes("cli-shared-types")) {
    finalScope.push("cli-shared-types");
  }

  const finalScopeWeighted = {};
  finalScope.forEach((scope) => {
    finalScopeWeighted[scope] = PACKAGE_WEIGHT_LIST[scope] || 1;
  });

  const sortedAllPackages = finalScope.sort(
    (a, b) => finalScopeWeighted[b] - finalScopeWeighted[a],
  );

  return sortedAllPackages.map((packageName) => `--scope=@${organizationName}/${packageName}`);
}

const _finalScope = getFinalScope(scope);

_finalScope.forEach((scope) => {
  const buildArgs = ["build", scope];

  // node scripts/build.js --check
  if (args.check) {
    buildArgs.shift();
    buildArgs.unshift("check:type");
  }

  const buildCommand = `lerna run ${buildArgs.join(" ")}`;
  console.log(`running build command: ${buildCommand}`);
  const { code: buildCode } = shell.exec(buildCommand);
  if (buildCode === 1) {
    console.log(`Failed: ${buildCommand}`);
    process.exit(1);
  }
});
