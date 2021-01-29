import path from "path";
import execa from "execa";
import minimist from "minimist";
import semver, { SemVer } from "semver";
import LRU from "lru-cache";

import { getPackageJson } from "./getPackageJson";
import { executeCommand } from "./executeCommand";
import { SUPPORTED_PACKAGE_MANAGER, PACKAGE_MANAGER_CONFIG } from "../definitions";

type LRUCacheValue =
  | string
  | string[]
  | Record<string, string>
  | Record<string, unknown>
  | undefined;

const metadataCache = new LRU<string, LRUCacheValue>({
  max: 200,
  // 30 min.
  maxAge: 1000 * 60 * 30,
});

const SUPPORTED_PACKAGE_MANAGERS: SUPPORTED_PACKAGE_MANAGER[] = ["npm"];
const PACKAGE_MANAGER_CONFIG: PACKAGE_MANAGER_CONFIG = {
  npm: {
    install: ["install", "--loglevel", "error"],
    add: ["install", "--loglevel", "error"],
    upgrade: ["update", "--loglevel", "error"],
    remove: ["uninstall", "--loglevel", "error"],
  },
};

function isObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === "[object Object]";
}

class PackageManager {
  private readonly context: string;
  private readonly bin: SUPPORTED_PACKAGE_MANAGER = "npm";

  private _registry: string;

  constructor({
    context,
    forcePackageManager,
  }: {
    context: string;
    forcePackageManager?: SUPPORTED_PACKAGE_MANAGER;
  }) {
    this.context = context;

    if (forcePackageManager) {
      this.bin = forcePackageManager;
    } else if (context) {
      this.bin = "npm";
    } else {
      this.bin = "npm";
    }

    if (!SUPPORTED_PACKAGE_MANAGERS.includes(this.bin)) {
      throw new Error(`Unknown package manager: ${this.bin}`);
    }
  }

  // Any command that implemented registry-related feature should support
  // `-r` / `--registry` option
  public async getRegistry(): Promise<string> {
    if (this._registry) {
      return this._registry;
    }

    const args = minimist(process.argv, {
      alias: {
        r: "registry",
      },
    });

    if (args.registry) {
      this._registry = args.registry;
    } else {
      const { stdout } = await execa(this.bin, ["config", "get", "registry"]);
      this._registry = stdout;
    }

    return this._registry;
  }

  public async addRegistryToArgs(args: string[]): Promise<string[]> {
    const registry = await this.getRegistry();
    args.push(`--registry=${registry}`);

    return args;
  }

  public async getMetadata(packageName: string, { field = "" } = {}): Promise<LRUCacheValue> {
    const registry = await this.getRegistry();

    const metadataKey = `${this.bin}-${registry}-${packageName}`;
    const metadata = metadataCache.get(metadataKey);

    if (metadata) {
      return metadata;
    }

    const args = await this.addRegistryToArgs(["info", packageName, field, "--json"]);
    const { stdout } = await execa(this.bin, args);

    const stdoutValue = JSON.parse(stdout);

    metadataCache.set(metadataKey, stdoutValue);

    return metadata;
  }

  public async getRemoteVersion(
    packageName: string,
    versionRange = "latest",
  ): Promise<string | SemVer | null> {
    const metadata = await this.getMetadata(packageName);

    if (!metadata) {
      return null;
    }

    if (Object.keys(metadata["dist-tags"]).includes(versionRange)) {
      return metadata["dist-tags"][versionRange];
    }

    if (isObject(metadata)) {
      const versions: string[] | SemVer = Array.isArray(metadata.versions)
        ? metadata.versions
        : isObject(metadata.versions)
        ? Object.keys(metadata.versions)
        : [];

      return semver.maxSatisfying(versions, versionRange);
    }

    return null;
  }

  public getInstalledVersion(packageName: string): string {
    try {
      const packageJson = getPackageJson(path.resolve(this.context, "node_modules", packageName));
      return packageJson.version;
    } catch (e) {
      return "N/A";
    }
  }

  public async install(packages?: string[]): Promise<void> {
    const args = await this.addRegistryToArgs(PACKAGE_MANAGER_CONFIG[this.bin].install);

    if (Array.isArray(packages)) {
      args.concat(packages);
    }

    return executeCommand(this.bin, args, this.context);
  }

  public async add(packageName: string, isDev = true): Promise<void> {
    const args = await this.addRegistryToArgs([
      ...PACKAGE_MANAGER_CONFIG[this.bin].add,
      packageName,
      ...(isDev ? ["-D"] : []),
    ]);
    return executeCommand(this.bin, args, this.context);
  }

  public async upgrade(packageName: string): Promise<void> {
    const args = await this.addRegistryToArgs([
      ...PACKAGE_MANAGER_CONFIG[this.bin].add,
      packageName,
    ]);
    return executeCommand(this.bin, args, this.context);
  }

  public async remove(packageName: string): Promise<void> {
    const args = [...PACKAGE_MANAGER_CONFIG[this.bin].remove, packageName];
    return executeCommand(this.bin, args, this.context);
  }
}

export { PackageManager };
