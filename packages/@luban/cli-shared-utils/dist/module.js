"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = __importDefault(require("semver"));
const module_1 = __importDefault(require("module"));
function resolveFallback(request, options) {
    const isMain = false;
    const fakeParent = new module_1.default("", module);
    const paths = [];
    for (let i = 0; i < options.paths.length; i++) {
        const path = options.paths[i];
        fakeParent.paths = module_1.default._nodeModulePaths(path);
        const lookupPaths = module_1.default._resolveLookupPaths(request, fakeParent, true);
        if (!paths.includes(path))
            paths.push(path);
        for (let j = 0; j < lookupPaths.length; j++) {
            if (!paths.includes(lookupPaths[j]))
                paths.push(lookupPaths[j]);
        }
    }
    const filename = module_1.default._findPath(request, paths, isMain);
    if (!filename) {
        const err = new Error(`Cannot find module '${request}'`);
        err.name = "MODULE_NOT_FOUND";
        throw err;
    }
    return filename;
}
function clearRequireCache(id, map = new Map()) {
    const module = require.cache[id];
    if (module) {
        map.set(id, true);
        module.children.forEach((child) => {
            if (!map.get(child.id))
                clearRequireCache(child.id, map);
        });
        delete require.cache[id];
    }
}
const resolve = semver_1.default.satisfies(process.version, ">=10.0.0") ? require.resolve : resolveFallback;
exports.resolveModule = function (request, context) {
    let resolvedPath = "";
    try {
        resolvedPath = resolve(request, { paths: [context] });
    }
    catch (e) { }
    return resolvedPath;
};
exports.loadModule = function (request, context, force = false) {
    const resolvedPath = exports.resolveModule(request, context);
    if (resolvedPath) {
        if (force) {
            clearRequireCache(resolvedPath);
        }
        return require(resolvedPath).default || require(resolvedPath);
    }
};
exports.clearModule = function (request, context) {
    const resolvedPath = exports.resolveModule(request, context);
    if (resolvedPath) {
        clearRequireCache(resolvedPath);
    }
};
