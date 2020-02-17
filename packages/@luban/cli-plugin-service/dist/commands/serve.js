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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = __importDefault(require("url"));
const path_1 = __importDefault(require("path"));
const webpack_1 = __importStar(require("webpack"));
const portfinder_1 = __importDefault(require("portfinder"));
const webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
const chalk_1 = __importDefault(require("chalk"));
const cli_shared_utils_1 = require("@luban/cli-shared-utils");
const fs_1 = require("fs");
const prepareURLs_1 = require("./../utils/prepareURLs");
const defaultServerConfig = {
    host: "0.0.0.0",
    port: 8080,
    https: false,
};
function isAbsoluteUrl(url) {
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}
function addDevClientToEntry(config, devClient) {
    const { entry } = config;
    if (typeof entry === "object" && !Array.isArray(entry)) {
        Object.keys(entry).forEach((key) => {
            entry[key] = devClient.concat(entry[key]);
        });
    }
    else if (typeof entry === "function") {
        config.entry = entry(devClient);
    }
    else {
        config.entry = devClient.concat(entry);
    }
}
function default_1(api, options) {
    api.registerCommand("serve", {
        description: "start development server",
        usage: "luban-cli-service serve [options]",
        options: {
            "--entry": "specify entry file",
            "--open": `open browser on server start`,
            "--mode": `specify env mode (default: development)`,
            "--host": `specify host (default: ${defaultServerConfig.host})`,
            "--port": `specify port (default: ${defaultServerConfig.port})`,
            "--https": `use https (default: ${defaultServerConfig.https})`,
            "--public": `specify the public network URL for the HMR client`,
        },
    }, (args) => __awaiter(this, void 0, void 0, function* () {
        const isProduction = process.env.NODE_ENV === "production";
        api.chainWebpack((webpackConfig) => {
            if (!isProduction) {
                webpackConfig.mode("development").devtool("cheap-module-eval-source-map");
                webpackConfig.plugin("hmr").use(webpack_1.HotModuleReplacementPlugin);
                webpackConfig.plugin("progress").use(webpack_1.ProgressPlugin);
            }
        });
        const webpackConfig = api.resolveWebpackConfig();
        const projectDevServerOptions = Object.assign(webpackConfig.devServer || {}, options.devServer);
        const entryFileOfApp = api.getEntryFile();
        if (!fs_1.existsSync(api.resolve(args.entry || `src/${entryFileOfApp}`))) {
            cli_shared_utils_1.error(`The entry file ${args.entry || `src/${entryFileOfApp}`} not exit, please check it`);
            process.exit();
        }
        webpackConfig.entry = {
            app: [api.resolve(args.entry || `src/${entryFileOfApp}`)],
        };
        if (!api.hasNoAnyFeatures) {
            webpackConfig.entry = {
                app: ["react-hot-loader/patch", api.resolve(args.entry || `src/${entryFileOfApp}`)],
            };
        }
        const useHttps = args.https || projectDevServerOptions.https || defaultServerConfig.https;
        const protocol = useHttps ? "https" : "http";
        const host = args.host || process.env.DEV_SERVER_HOST || projectDevServerOptions.host || defaultServerConfig.host;
        const _port = args.port || process.env.DEV_SERVER_PORT || projectDevServerOptions.port || defaultServerConfig.port;
        const port = yield portfinder_1.default.getPortPromise({ port: Number(_port) });
        const rawPublicUrl = args.public || projectDevServerOptions.public;
        const publicUrl = rawPublicUrl
            ? /^[a-zA-Z]+:\/\//.test(rawPublicUrl)
                ? rawPublicUrl
                : `${protocol}://${rawPublicUrl}`
            : null;
        const urls = prepareURLs_1.prepareUrls(protocol, host, port, isAbsoluteUrl(options.publicPath) ? "/" : options.publicPath);
        const localUrlForBrowser = publicUrl || urls.localUrlForBrowser;
        if (!isProduction) {
            const sockjsUrl = publicUrl
                ?
                    `?${publicUrl}/sockjs-node`
                : `?` +
                    url_1.default.format({
                        protocol,
                        port,
                        hostname: urls.lanUrlForConfig || "localhost",
                        pathname: "/sockjs-node",
                    });
            const devClients = [
                require.resolve("webpack-dev-server/client") + sockjsUrl,
                require.resolve(projectDevServerOptions.hotOnly ? "webpack/hot/only-dev-server" : "webpack/hot/dev-server"),
            ];
            addDevClientToEntry(webpackConfig, devClients);
        }
        const compiler = webpack_1.default(webpackConfig);
        const webpackDevServerOptions = Object.assign(Object.assign({}, projectDevServerOptions), { clientLogLevel: "info", historyApiFallback: {
                disableDotRule: true,
                rewrites: [{ from: /./, to: path_1.default.posix.join(options.publicPath || "/", "index.html") }],
            }, contentBase: api.resolve("public"), watchContentBase: !isProduction, hot: !isProduction, compress: isProduction, publicPath: options.publicPath, overlay: { warnings: false, errors: true }, https: useHttps, before: (app, server) => {
                api.service.webpackDevServerConfigCallback.forEach((callback) => callback(app, server));
                projectDevServerOptions.before && projectDevServerOptions.before(app, server, compiler);
            }, open: false, stats: {
                version: true,
                timings: true,
                colors: true,
                modules: false,
                children: false,
            }, proxy: projectDevServerOptions.proxy });
        const server = new webpack_dev_server_1.default(compiler, webpackDevServerOptions);
        ["SIGINT", "SIGTERM"].forEach((signal) => {
            process.on(signal, () => {
                server.close();
                process.exit();
            });
        });
        return new Promise((resolve, reject) => {
            let isFirstCompile = true;
            compiler.hooks.done.tap("luban-cli-service serve", (stats) => {
                if (stats.hasErrors()) {
                    stats.toJson().errors.forEach((err) => {
                        cli_shared_utils_1.log(err);
                    });
                    return;
                }
                const networkUrl = publicUrl ? publicUrl.replace(/([^/])$/, "$1/") : urls.lanUrlForTerminal;
                console.log();
                console.log(`  App running at:`);
                console.log(`  - Local:   ${chalk_1.default.cyan(urls.localUrlForTerminal)}`);
                console.log(`  - Network: ${chalk_1.default.cyan(networkUrl)}`);
                console.log();
                if (isFirstCompile) {
                    isFirstCompile = false;
                    const buildCommand = "npm run build";
                    console.log(`  Note that the development build is not optimized.`);
                    console.log(`  To create a production build, run ${chalk_1.default.cyan(buildCommand)}.`);
                    console.log(`  To exit the server, use ${chalk_1.default.red("control + z")}`);
                    console.log();
                    if (args.open || projectDevServerOptions.open) {
                        const pageUri = projectDevServerOptions.openPage && typeof projectDevServerOptions.openPage === "string"
                            ? projectDevServerOptions.openPage
                            : "";
                        cli_shared_utils_1.openBrowser(localUrlForBrowser + pageUri);
                    }
                    const ipc = new cli_shared_utils_1.IpcMessenger();
                    ipc.send({
                        lubanServer: {
                            url: localUrlForBrowser,
                        },
                    });
                    resolve({
                        server,
                        url: localUrlForBrowser,
                    });
                }
            });
            server.listen(port, host, (err) => {
                if (err) {
                    reject(err);
                }
            });
        });
    }));
}
exports.default = default_1;
//# sourceMappingURL=serve.js.map