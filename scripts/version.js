"use strict";

const shell = require("shelljs");
const { readJSONSync, writeFileSync } = require("fs-extra");
const prettier = require("prettier");

const rawArgs = process.argv.slice(2);

const args = [...rawArgs, "--no-push", "--yes", "--conventional-commits", "--force-publish='*'"];

const versionCommand = `lerna version ${args.join(" ")}`;

console.log(versionCommand);

const { code: versionCode } = shell.exec(versionCommand);
if (versionCode === 1) {
  console.error(`Failed: ${versionCommand}`);
  process.exit(1);
}

try {
  const lernaConfigPath = `${process.cwd()}/lerna.json`;
  const lernaConfig = readJSONSync(lernaConfigPath, { encoding: "utf-8" });
  const newVersion = lernaConfig.version;

  const docPackageJsonPath = `${process.cwd()}/doc/package.json`;
  const content = readJSONSync(docPackageJsonPath, { encoding: "utf-8" });

  content.scripts["doc:dev"] = `__LUBAN_VERSION__=${newVersion} vuepress dev . --open --temp .temp`;
  content.scripts["doc:build"] = `__LUBAN_VERSION__=${newVersion} vuepress build . --temp .temp`;

  const _content = prettier.format(JSON.stringify(content), { parser: "json" });
  writeFileSync(docPackageJsonPath, _content, { encoding: "utf-8" });
} catch (e) {
  console.log("synchronization version failed");
  process.exit(1);
}

const { code: pushCode } = shell.exec("git push --follow-tags --no-verify --atomic");
if (pushCode === 1) {
  console.error("git push failed");
  process.exit(1);
}

console.log("versioned success");
