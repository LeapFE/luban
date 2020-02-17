import semver from "semver";

import Module from "module";

function resolveFallback(request: string, options: { paths: string[] }): string {
  const isMain = false;
  const fakeParent = new Module("", module);

  const paths: string[] = [];

  for (let i = 0; i < options.paths.length; i++) {
    const path = options.paths[i];
    fakeParent.paths = (Module as any)._nodeModulePaths(path);
    const lookupPaths = (Module as any)._resolveLookupPaths(request, fakeParent, true);

    if (!paths.includes(path)) paths.push(path);

    for (let j = 0; j < lookupPaths.length; j++) {
      if (!paths.includes(lookupPaths[j])) paths.push(lookupPaths[j]);
    }
  }

  const filename = (Module as any)._findPath(request, paths, isMain);
  if (!filename) {
    const err = new Error(`Cannot find module '${request}'`);
    err.name = "MODULE_NOT_FOUND";
    throw err;
  }

  return filename;
}

function clearRequireCache(id: string, map: Map<string, boolean> = new Map()): void {
  const module = require.cache[id];
  if (module) {
    map.set(id, true);
    // Clear children modules
    module.children.forEach((child: any) => {
      if (!map.get(child.id)) clearRequireCache(child.id, map);
    });
    delete require.cache[id];
  }
}

const resolve = semver.satisfies(process.version, ">=10.0.0") ? require.resolve : resolveFallback;

export const resolveModule = function(request: string, context: string): string {
  let resolvedPath: string = "";
  try {
    resolvedPath = resolve(request, { paths: [context] });
  } catch (e) {}

  return resolvedPath;
};

export const loadModule = function(request: string, context: string, force = false): any {
  const resolvedPath = resolveModule(request, context);
  if (resolvedPath) {
    if (force) {
      clearRequireCache(resolvedPath);
    }

    return require(resolvedPath).default || require(resolvedPath);
  }
};

export const clearModule = function(request: string, context: string): void {
  const resolvedPath = resolveModule(request, context);
  if (resolvedPath) {
    clearRequireCache(resolvedPath);
  }
};
