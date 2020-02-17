"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const execa_1 = __importDefault(require("execa"));
const minimist_1 = __importDefault(require("minimist"));
const semver_1 = __importDefault(require("semver"));
const lru_cache_1 = __importDefault(require("lru-cache"));
const getPackageJson_1 = require("./getPackageJson");
const executeCommand_1 = require("./executeCommand");
const metadataCache = new lru_cache_1.default({
    max: 200,
    maxAge: 1000 * 60 * 30,
});
const SUPPORTED_PACKAGE_MANAGERS = ["npm"];
const PACKAGE_MANAGER_CONFIG = {
    npm: {
        install: ["install", "--loglevel", "error"],
        add: ["install", "--loglevel", "error"],
        upgrade: ["update", "--loglevel", "error"],
        remove: ["uninstall", "--loglevel", "error"],
    },
};
class PackageManager {
    constructor({ context, forcePackageManager, }) {
        this.bin = "npm";
        this.context = context;
        if (forcePackageManager) {
            this.bin = forcePackageManager;
        }
        else if (context) {
            this.bin = "npm";
        }
        else {
            this.bin = "npm";
        }
        if (!SUPPORTED_PACKAGE_MANAGERS.includes(this.bin)) {
            throw new Error(`Unknown package manager: ${this.bin}`);
        }
    }
    getRegistry() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._registry) {
                return this._registry;
            }
            const args = minimist_1.default(process.argv, {
                alias: {
                    r: "registry",
                },
            });
            if (args.registry) {
                this._registry = args.registry;
            }
            else {
                const { stdout } = yield execa_1.default(this.bin, ["config", "get", "registry"]);
                this._registry = stdout;
            }
            return this._registry;
        });
    }
    addRegistryToArgs(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const registry = yield this.getRegistry();
            args.push(`--registry=${registry}`);
            return args;
        });
    }
    getMetadata(packageName, { field = "" } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const registry = yield this.getRegistry();
            const metadataKey = `${this.bin}-${registry}-${packageName}`;
            const metadata = metadataCache.get(metadataKey);
            if (metadata) {
                return metadata;
            }
            const args = yield this.addRegistryToArgs(["info", packageName, field, "--json"]);
            const { stdout } = yield execa_1.default(this.bin, args);
            const stdoutValue = JSON.parse(stdout);
            metadataCache.set(metadataKey, stdoutValue);
            return metadata;
        });
    }
    getRemoteVersion(packageName, versionRange = "latest") {
        return __awaiter(this, void 0, void 0, function* () {
            const metadata = yield this.getMetadata(packageName);
            if (!metadata) {
                return null;
            }
            if (Object.keys(metadata["dist-tags"]).includes(versionRange)) {
                return metadata["dist-tags"][versionRange];
            }
            const versions = Array.isArray(metadata.versions)
                ? metadata.versions
                : Object.keys(metadata.versions);
            return semver_1.default.maxSatisfying(versions, versionRange);
        });
    }
    getInstalledVersion(packageName) {
        try {
            const packageJson = getPackageJson_1.getPackageJson(path_1.default.resolve(this.context, "node_modules", packageName));
            return packageJson.version;
        }
        catch (e) {
            return "N/A";
        }
    }
    install() {
        return __awaiter(this, void 0, void 0, function* () {
            const args = yield this.addRegistryToArgs(PACKAGE_MANAGER_CONFIG[this.bin].install);
            return executeCommand_1.executeCommand(this.bin, args, this.context);
        });
    }
    add(packageName, isDev = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = yield this.addRegistryToArgs([
                ...PACKAGE_MANAGER_CONFIG[this.bin].add,
                packageName,
                ...(isDev ? ["-D"] : []),
            ]);
            return executeCommand_1.executeCommand(this.bin, args, this.context);
        });
    }
    upgrade(packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = yield this.addRegistryToArgs([
                ...PACKAGE_MANAGER_CONFIG[this.bin].add,
                packageName,
            ]);
            return executeCommand_1.executeCommand(this.bin, args, this.context);
        });
    }
    remove(packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = [...PACKAGE_MANAGER_CONFIG[this.bin].remove, packageName];
            return executeCommand_1.executeCommand(this.bin, args, this.context);
        });
    }
}
exports.PackageManager = PackageManager;
//# sourceMappingURL=packageManager.js.map