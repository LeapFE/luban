"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.getPackageJson = function (projectPath) {
    const packagePath = path_1.default.join(projectPath, "package.json");
    let packageJson = "";
    try {
        packageJson = fs_1.default.readFileSync(packagePath, "utf-8");
    }
    catch (err) {
        throw new Error(`${packagePath} not exist`);
    }
    let packageJsonParsed = { name: "", version: "" };
    try {
        packageJsonParsed = JSON.parse(packageJson);
    }
    catch (err) {
        throw new Error("The package.json is malformed");
    }
    return packageJsonParsed;
};
//# sourceMappingURL=getPackageJson.js.map