"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
const optimize_css_assets_webpack_plugin_1 = __importDefault(require("optimize-css-assets-webpack-plugin"));
const cssnano_1 = __importDefault(require("cssnano"));
const terserOptions_1 = require("./../utils/terserOptions");
function getScriptsDir(dir) {
    const adaptedDir = dir.replace(/^\/|\/$|\s+/g, "");
    if (adaptedDir === "") {
        return "";
    }
    return `${adaptedDir}/`;
}
function default_1(api, options) {
    api.chainWebpack((webpackConfig) => {
        const isProduction = process.env.NODE_ENV === "production";
        const outputDir = api.resolve(options.outputDir);
        const scriptsDir = getScriptsDir(options.assetsDir.scripts);
        const filename = `${scriptsDir}[name]-[hash:8].js`;
        const chunkFilename = `${scriptsDir}[name]-[chunkhash:8].js`;
        webpackConfig.output
            .path(outputDir)
            .filename(filename)
            .chunkFilename(chunkFilename)
            .end();
        if (options.productionSourceMap) {
            webpackConfig.output.sourceMapFilename("[name].[hash:8]-map.js").end();
        }
        if (isProduction) {
            webpackConfig.mode("production").devtool(options.productionSourceMap ? "source-map" : false);
            webpackConfig
                .plugin("hash-module-ids")
                .use(require("webpack/lib/HashedModuleIdsPlugin"), [{ hashDigest: "hex" }]);
        }
        if (isProduction) {
            webpackConfig.optimization
                .splitChunks({
                cacheGroups: {
                    common: {
                        chunks: "initial",
                        name: "common",
                        minChunks: 2,
                        maxInitialRequests: 5,
                        minSize: 0,
                    },
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        chunks: "initial",
                        name: "vendors",
                        priority: 10,
                        enforce: true,
                    },
                    style: {
                        test: /\.css$/,
                        name: "style",
                        chunks: "all",
                    },
                },
            })
                .runtimeChunk({
                name: "manifest",
            })
                .minimizer("terser")
                .use(terser_webpack_plugin_1.default, [terserOptions_1.terserOptions(options)])
                .end()
                .minimizer("optimizeCss")
                .use(optimize_css_assets_webpack_plugin_1.default, [
                {
                    cssProcessor: cssnano_1.default,
                    cssProcessorPluginOptions: {
                        preset: [
                            "default",
                            {
                                discardComments: { removeAll: false },
                                discardEmpty: { removeAll: true },
                                discardUnused: { removeAll: true },
                            },
                        ],
                    },
                },
            ])
                .end();
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=prod.js.map