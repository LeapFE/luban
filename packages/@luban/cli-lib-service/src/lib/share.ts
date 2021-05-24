import fs from "fs";
import path from "path";
import { PluginObj } from "@babel/core";
import {
  BasePkgFields,
  TypeScriptConfigurationFile,
} from "@luban-cli/cli-shared-types/dist/shared";

const cwd = process.cwd();

export function getProjectPath(...filePath: string[]) {
  return path.join(cwd, ...filePath);
}

export function getProjectPackageJson(): BasePkgFields {
  const filePath = getProjectPath("package.json");

  if (filePath) {
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch (err) {
      console.error(err);
    }
  }

  return { name: "", version: "" };
}

export function getProjectTsConfigJson(): TypeScriptConfigurationFile {
  const filePath = getProjectPath("tsconfig.json");

  if (filePath) {
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch (err) {
      console.error(err);
    }
  }

  return { compilerOptions: {} };
}

export function replaceLib(): PluginObj {
  return {
    visitor: {
      ImportDeclaration: (_path) => {
        if (_path.node.source && /\/lib\//.test(_path.node.source.value)) {
          const esModule = _path.node.source.value.replace("/lib/", "/es/");
          const esPath = path.dirname(getProjectPath("node_modules", esModule));
          if (fs.existsSync(esPath)) {
            _path.node.source.value = esModule;
          }
        }
      },
      ExportNamedDeclaration: (_path) => {
        if (_path.node.source && /\/lib\//.test(_path.node.source.value)) {
          const esModule = _path.node.source.value.replace("/lib/", "/es/");
          const esPath = path.dirname(getProjectPath("node_modules", esModule));
          if (fs.existsSync(esPath)) {
            _path.node.source.value = esModule;
          }
        }
      },
    },
  };
}

let injected = false;
export function injectRequire() {
  if (injected) return;

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Module = require("module");

  const oriRequire = Module.prototype.require;
  Module.prototype.require = function(...args: unknown[]) {
    const moduleName = args[0];
    try {
      return oriRequire.apply(this, args);
    } catch (err) {
      const newArgs = [...args];
      if (Array.isArray(moduleName) && moduleName[0] !== "/") {
        newArgs[0] = getProjectPath("node_modules", moduleName[0]);
      }
      return oriRequire.apply(this, newArgs);
    }
  };

  injected = true;
}
