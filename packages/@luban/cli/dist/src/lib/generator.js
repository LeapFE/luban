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
const ejs_1 = __importDefault(require("ejs"));
const semver_1 = __importDefault(require("semver"));
const cli_shared_utils_1 = require("@luban-cli/cli-shared-utils");
const generatorAPI_1 = require("./generatorAPI");
const packageManager_1 = require("../utils/packageManager");
const sortObject_1 = require("../utils/sortObject");
const constants_1 = require("../constants");
const logTypes = {
    log: cli_shared_utils_1.log,
    info: cli_shared_utils_1.info,
    done: cli_shared_utils_1.done,
    warn: cli_shared_utils_1.warn,
    error: cli_shared_utils_1.error,
};
class Generator {
    constructor(context, { pkg = { name: "", version: "" }, plugins, files = {} }) {
        this.context = context;
        this.plugins = plugins;
        this.pkg = Object.assign({}, pkg);
        this.pm = new packageManager_1.PackageManager({ context });
        this.files = files;
        this.fileMiddlewares = [];
        this.postProcessFilesCbs = [];
        this.exitLogs = [];
        this.allPluginIds = Object.keys(this.pkg.dependencies || {}).concat(Object.keys(this.pkg.devDependencies || {}));
        const cliService = plugins.find((p) => p.id === "@luban-cli/cli-plugin-service");
        this.rootOptions = cliService
            ? cliService.options
            : constants_1.defaultRootOptions;
    }
    initPlugins() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rootOptions } = this;
            for (const plugin of this.plugins) {
                const { id, apply, options } = plugin;
                const api = new generatorAPI_1.GeneratorAPI(id, this, options, rootOptions);
                yield apply(api, rootOptions);
            }
        });
    }
    generate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initPlugins();
            const initialFiles = Object.assign({}, this.files);
            yield this.resolveFiles();
            this.sortPkg();
            this.files["package.json"] = JSON.stringify(this.pkg, null, 2) + "\n";
            yield cli_shared_utils_1.writeFileTree(this.context, this.files, initialFiles);
        });
    }
    sortPkg() {
        this.pkg.dependencies = sortObject_1.sortObject(this.pkg.dependencies || {});
        this.pkg.devDependencies = sortObject_1.sortObject(this.pkg.devDependencies || {});
        this.pkg.scripts = sortObject_1.sortObject(this.pkg.scripts || {}, ["dev", "build", "test:unit", "lint"]);
        this.pkg = sortObject_1.sortObject(this.pkg, [
            "name",
            "version",
            "private",
            "description",
            "author",
            "scripts",
            "main",
            "module",
            "browser",
            "jsDelivr",
            "unpkg",
            "files",
            "dependencies",
            "devDependencies",
            "peerDependencies",
            "babel",
            "eslintConfig",
            "prettier",
            "postcss",
            "browserslist",
            "jest",
        ]);
    }
    resolveFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = this.files;
            for (const middleware of this.fileMiddlewares) {
                yield middleware(files, ejs_1.default.render);
            }
            for (const postProcess of this.postProcessFilesCbs) {
                yield postProcess(files);
            }
        });
    }
    hasPlugin(_id, _version) {
        return [...this.plugins.map((p) => p.id), ...this.allPluginIds].some((id) => {
            if (id !== _id) {
                return false;
            }
            if (!_version) {
                return true;
            }
            const version = this.pm.getInstalledVersion(id);
            return semver_1.default.satisfies(version, _version);
        });
    }
    printExitLogs() {
        if (this.exitLogs.length) {
            this.exitLogs.forEach(({ id, msg, type }) => {
                const logFn = logTypes[type];
                if (!logFn) {
                    cli_shared_utils_1.error(`Invalid api.exitLog type '${type}'.`, id);
                }
                else {
                    logFn(msg, msg && id);
                }
            });
            cli_shared_utils_1.log();
        }
    }
}
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map