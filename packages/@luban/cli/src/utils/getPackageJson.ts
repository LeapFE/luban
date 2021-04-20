import fs from "fs";
import path from "path";

import { BasePkgFields } from "../definitions";

export const getPackageJson = function(projectPath: string): BasePkgFields {
  const packagePath = path.join(projectPath, "package.json");

  let packageJson: string = "";
  try {
    packageJson = fs.readFileSync(packagePath, "utf-8");
  } catch (err) {
    throw new Error(`${packagePath} not exist`);
  }

  let packageJsonParsed: BasePkgFields = { name: "", version: "" };
  try {
    packageJsonParsed = JSON.parse(packageJson);
  } catch (err) {
    throw new Error("The package.json is malformed");
  }

  return packageJsonParsed;
};
