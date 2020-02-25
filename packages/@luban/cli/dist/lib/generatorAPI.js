"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const deepmerge_1 = __importDefault(require("deepmerge"));
const resolve_1 = __importDefault(require("resolve"));
const isbinaryfile_1 = require("isbinaryfile");
const globby_1 = __importDefault(require("globby"));
const execa_1 = __importDefault(require("execa"));
const yaml = require("yaml-front-matter");
const mergeDeps_1 = require("../utils/mergeDeps");
const configTransforms_1 = require("../utils/configTransforms");
const isObject = (val) => val !== null && typeof val === "object";
function extractCallDir() {
    const errorStack = { stack: "" };
    Error.captureStackTrace(errorStack);
    const callSite = errorStack.stack.split("\n")[3];
    if (callSite) {
        const fileNameMatchResult = callSite.match(/\s\((.*):\d+:\d+\)$/);
        if (Array.isArray(fileNameMatchResult)) {
            return path_1.default.dirname(fileNameMatchResult[1]);
        }
    }
    return "";
}
const replaceBlockRE = /<%# REPLACE %>([^]*?)<%# END_REPLACE %>/g;
function renderFile(name, data, ejsOptions) {
    if (isbinaryfile_1.isBinaryFileSync(name)) {
        return fs_1.default.readFileSync(name).toString();
    }
    const template = fs_1.default.readFileSync(name, "utf-8");
    const parsed = yaml.loadFront(template);
    const content = parsed.__content;
    let finalTemplate = content.trim() + `\n`;
    if (parsed.when) {
        finalTemplate = `<%_ if (${parsed.when}) { _%>` + finalTemplate + `<%_ } _%>`;
        const result = ejs_1.default.render(finalTemplate, data, ejsOptions);
        if (!result) {
            return "";
        }
    }
    if (parsed.extend) {
        const extendPath = path_1.default.isAbsolute(parsed.extend)
            ? parsed.extend
            : resolve_1.default.sync(parsed.extend, { basedir: path_1.default.dirname(name) });
        finalTemplate = fs_1.default.readFileSync(extendPath, "utf-8");
        if (parsed.replace) {
            if (Array.isArray(parsed.replace)) {
                const replaceMatch = content.match(replaceBlockRE);
                if (replaceMatch) {
                    const replaces = replaceMatch.map((m) => {
                        return m.replace(replaceBlockRE, "$1").trim();
                    });
                    parsed.replace.forEach((r, i) => {
                        finalTemplate = finalTemplate.replace(r, replaces[i]);
                    });
                }
            }
            else {
                finalTemplate = finalTemplate.replace(parsed.replace, content.trim());
            }
        }
    }
    return ejs_1.default.render(finalTemplate, data, { ...ejsOptions, async: false });
}
class GeneratorAPI {
    constructor(id, generator, options, rootOptions) {
        this.id = id;
        this.generator = generator;
        this.options = options;
        this.rootOptions = rootOptions;
        this.pluginsData = generator.plugins
            .filter(({ id }) => id !== "@luban-cli/cli-plugin-service")
            .map(({ id }) => ({
            name: id,
            link: "",
        }));
        this._entryFile = undefined;
    }
    _resolveData(additionalData) {
        return Object.assign({
            options: this.options,
            rootOptions: this.rootOptions,
            plugins: this.pluginsData,
        }, additionalData);
    }
    _injectFileMiddleware(middleware) {
        this.generator.fileMiddlewares.push(middleware);
    }
    resolve(_path) {
        return path_1.default.resolve(this.generator.context, _path);
    }
    get cliVersion() {
        return require("../package.json").version;
    }
    hasPlugin(id, version) {
        return this.generator.hasPlugin(id, version);
    }
    extendPackage(fields, forceNewVersion) {
        const pkg = this.generator.pkg;
        const toMerge = typeof fields === "function" ? fields(pkg) : fields;
        for (const key in toMerge) {
            const value = toMerge[key];
            const existing = pkg[key];
            if (isObject(value) && (key === "dependencies" || key === "devDependencies")) {
                pkg[key] = mergeDeps_1.resolveDeps(this.id, existing || {}, value, {}, forceNewVersion);
            }
            else if (!(key in pkg)) {
                pkg[key] = value;
            }
            else if (Array.isArray(value) && Array.isArray(existing)) {
                pkg[key] = configTransforms_1.mergeArrayWithDedupe(existing, value);
            }
            else if (isObject(value) && isObject(existing)) {
                pkg[key] = deepmerge_1.default(existing, value, { arrayMerge: configTransforms_1.mergeArrayWithDedupe });
            }
            else {
                pkg[key] = value;
            }
        }
    }
    render(source, additionalData = {}, ejsOptions = {}) {
        const baseDir = extractCallDir();
        if (typeof source === "string") {
            source = path_1.default.resolve(baseDir, source);
            this._injectFileMiddleware(async (files) => {
                const data = this._resolveData(additionalData);
                const _files = await globby_1.default(["**/*"], { cwd: source });
                for (const rawPath of _files) {
                    const targetPath = rawPath
                        .split("/")
                        .map((filename) => {
                        if (filename.charAt(0) === "_" && filename.charAt(1) !== "_") {
                            return `.${filename.slice(1)}`;
                        }
                        if (filename.charAt(0) === "_" && filename.charAt(1) === "_") {
                            return `${filename.slice(1)}`;
                        }
                        return filename;
                    })
                        .join("/");
                    const sourcePath = path_1.default.resolve(source, rawPath);
                    const content = renderFile(sourcePath, data, ejsOptions);
                    if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
                        files[targetPath] = content;
                    }
                }
            });
        }
        else if (typeof source === "object" && source !== null) {
            this._injectFileMiddleware((files) => {
                const data = this._resolveData(additionalData);
                for (const targetPath in source) {
                    const sourcePath = path_1.default.resolve(baseDir, source[targetPath]);
                    const content = renderFile(sourcePath, data, ejsOptions);
                    if (Buffer.isBuffer(content) || content.trim()) {
                        files[targetPath] = content;
                    }
                }
            });
        }
        else if (typeof source === "function") {
            this._injectFileMiddleware(source);
        }
    }
    postProcessFiles(cb) {
        this.generator.postProcessFilesCbs.push(cb);
    }
    addExitLog(msg, type = "log") {
        this.generator.exitLogs.push({ id: this.id, msg, type });
    }
    static makeJSOnlyValue(str) {
        const fn = () => undefined;
        fn.__expression = str;
        return fn;
    }
    get entryFile() {
        if (this._entryFile)
            return this._entryFile;
        this._entryFile = fs_1.default.existsSync(this.resolve("src/index.tsx"))
            ? "src/index.tsx"
            : "src/index.jsx";
        return this._entryFile;
    }
    run(command, args) {
        if (!args) {
            [command, ...args] = command.split(/\s+/);
        }
        return execa_1.default(command, args, { cwd: this.generator.context });
    }
    isGitRepository() {
        return fs_1.default.existsSync(path_1.default.join(this.generator.context, ".git"));
    }
}
exports.GeneratorAPI = GeneratorAPI;
//# sourceMappingURL=generatorAPI.js.map