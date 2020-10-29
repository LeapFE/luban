function clearRequireCache(id: string, map: Map<string, boolean> = new Map()): void {
  const module = require.cache[id];

  if (module) {
    map.set(id, true);

    // Clear children modules
    module.children.forEach((child) => {
      if (!map.get(child.id)) {
        clearRequireCache(child.id, map);
      }
    });

    delete require.cache[id];
  }
}

export const loadFile = function<T>(path: string): T | undefined {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const m = require(path);

  // first check module is ESModule
  return m && m.__esModule ? m.default : m;
};

export const resolveModule = function(request: string, context: string): string {
  let resolvedPath: string = "";
  try {
    resolvedPath = require.resolve(request, { paths: [context] });
  } catch (e) {}

  return resolvedPath;
};

/**
 * load a module base on module path and context
 *
 * @param request
 * @param context
 * @param force
 * @throws {Error} Throw "Cannot find module" Error
 */
export const loadModule = function<T = unknown>(
  request: string,
  context: string,
  force = false,
): T | undefined {
  const resolvedPath = resolveModule(request, context);

  if (resolvedPath) {
    if (force) {
      clearRequireCache(resolvedPath);
    }

    return loadFile(resolvedPath);
  }
};

export const clearModule = function(request: string, context: string): void {
  const resolvedPath = resolveModule(request, context);
  if (resolvedPath) {
    clearRequireCache(resolvedPath);
  }
};
