"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
class PluginAPI {
    constructor(id, service) {
        this.id = id;
        this.service = service;
    }
    getCwd() {
        return this.service.context;
    }
    resolve(_path) {
        return path_1.default.resolve(this.service.context, _path);
    }
    hasPlugin(id) {
        const prefixRE = /^cli-plugin-/;
        return this.service.plugins.some((p) => {
            return p.id === id || p.id.replace(prefixRE, "") === id;
        });
    }
    resolveInitConfig() {
        return this.service.resolveLubanConfig();
    }
    getEntryFile() {
        return this.resolveInitConfig().language === "ts" ? "index.tsx" : "index.jsx";
    }
    setMode(mode) {
        process.env.LUBAN_CLI_SERVICE_MODE = mode;
        process.env.NODE_ENV = process.env.BABEL_ENV =
            mode === "production" || mode === "test" ? mode : "development";
        this.service.loadEnv(mode);
    }
    registerCommand(name, opts, fn) {
        if (typeof opts === "function") {
            fn = opts;
            opts = null;
        }
        this.service.commands[name] = { fn, opts };
    }
    chainWebpack(fn) {
        this.service.webpackChainCallback.push(fn);
    }
    configureWebpack(fn) {
        this.service.webpackRawConfigCallback.push(fn);
    }
    resolveChainableWebpackConfig() {
        return this.service.resolveChainableWebpackConfig();
    }
    resolveWebpackConfig(config) {
        return this.service.resolveWebpackConfig(config);
    }
    configureDevServer(fn) {
        this.service.webpackDevServerConfigCallback.push(fn);
    }
}
exports.PluginAPI = PluginAPI;
//# sourceMappingURL=PluginAPI.js.map