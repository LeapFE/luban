"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
const clean_webpack_plugin_1 = require("clean-webpack-plugin");
const getAssetsPath_1 = require("./../utils/getAssetsPath");
const resolveClientEnv_1 = require("./../utils/resolveClientEnv");
const terserOptions_1 = require("./../utils/terserOptions");
function default_1(api, options) {
    const genAssetSubPath = function (dir) {
        return getAssetsPath_1.getAssetsPath(options, `${dir}/[name].[hash:8].[ext]`);
    };
    const genUrlLoaderOptions = function (dir) {
        return {
            limit: options.assetsLimit,
            fallback: {
                loader: "file-loader",
                options: {
                    name: genAssetSubPath(dir),
                },
            },
        };
    };
    const isProduction = process.env.NODE_ENV === "production";
    const entryFileOfApp = api.getEntryFile();
    const isTSProject = api.resolveInitConfig().language === "ts";
    api.chainWebpack((webpackConfig) => {
        webpackConfig
            .mode("development")
            .context(api.service.context)
            .entry("app")
            .add(`./src/${entryFileOfApp}`)
            .end()
            .output.path(api.resolve(options.outputDir))
            .filename("[name].js")
            .publicPath(options.publicPath);
        webpackConfig.resolve.extensions
            .merge([".js", ".jsx", ".ts", ".json", ".tsx"])
            .end()
            .modules.add("node_modules")
            .add(api.resolve("node_modules"))
            .end()
            .alias.set("@", api.resolve("src"))
            .end();
        if (options.alias) {
            Object.keys(options.alias).forEach((key) => {
                webpackConfig.resolve.alias.set(key, options.alias[key]);
            });
        }
        const jsRule = webpackConfig.module.rule("js");
        const tsRule = webpackConfig.module.rule("ts");
        const eslintRule = webpackConfig.module.rule("eslint");
        eslintRule
            .test(isTSProject ? /\.ts[x]?$/ : /\.jsx?$/)
            .enforce("pre")
            .exclude.add(/node_modules/)
            .end()
            .use("eslint-loader")
            .loader("eslint-loader")
            .end();
        if (isTSProject && isProduction) {
            tsRule
                .test(/\.ts[x]?$/)
                .exclude.add(/node_modules/)
                .end()
                .use("babel-loader")
                .loader("babel-loader")
                .options({ cacheDirectory: true })
                .end();
        }
        if (isTSProject && !isProduction) {
            tsRule
                .test(/\.ts[x]?$/)
                .exclude.add(/node_modules/)
                .end()
                .use("ts-loader")
                .loader("ts-loader")
                .options({ transpileOnly: true })
                .end();
        }
        if (!isTSProject) {
            jsRule
                .test(/\.jsx?$/)
                .include.add(api.resolve("src"))
                .end()
                .exclude.add(/node_modules/)
                .end()
                .use("babel-loader")
                .loader("babel-loader")
                .options({ cacheDirectory: true })
                .end();
        }
        webpackConfig.module
            .rule("images")
            .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
            .use("url-loader")
            .loader("url-loader")
            .options(genUrlLoaderOptions("img"));
        webpackConfig.module
            .rule("media")
            .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
            .use("url-loader")
            .loader("url-loader")
            .options(genUrlLoaderOptions("media"));
        webpackConfig.module
            .rule("fonts")
            .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
            .use("url-loader")
            .loader("url-loader")
            .options(genUrlLoaderOptions("fonts"));
        webpackConfig.node.merge({
            process: "mock",
            dgram: "empty",
            fs: "empty",
            net: "empty",
            tls: "empty",
            child_process: "empty",
        });
        webpackConfig
            .plugin("define")
            .use(require("webpack").DefinePlugin, [resolveClientEnv_1.resolveClientEnv(options)]);
        webpackConfig.plugin("clean").use(clean_webpack_plugin_1.CleanWebpackPlugin, [{ verbose: true }]);
        webpackConfig.optimization
            .minimizer("terser")
            .use(terser_webpack_plugin_1.default, [terserOptions_1.terserOptions(options)]);
    });
}
exports.default = default_1;
//# sourceMappingURL=base.js.map