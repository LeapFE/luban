"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const getAssetsPath_1 = require("./../utils/getAssetsPath");
function default_1(api, options) {
    api.chainWebpack((webpackConfig) => {
        const isProduction = process.env.NODE_ENV === "production";
        const createConfig = api.resolveInitConfig();
        const { css: { extract = isProduction, sourceMap = !isProduction, loaderOptions }, } = options;
        const filename = getAssetsPath_1.getAssetsPath(options, `css/[name]${isProduction ? ".[hash:8]" : ""}.css`);
        const chunkFilename = getAssetsPath_1.getAssetsPath(options, `css/[name]${isProduction ? ".[chunkhash:8]" : ""}.css`);
        const extractOptions = {
            filename,
            chunkFilename,
        };
        const miniCssOptions = {
            ...loaderOptions.miniCss,
            hmr: !isProduction,
            reloadAll: !isProduction,
        };
        const cssLoaderOptions = {
            ...loaderOptions.css,
            sourceMap,
        };
        const cssRule = webpackConfig.module.rule("css");
        cssRule.test(/\.css$/).end();
        if (extract) {
            cssRule
                .use("extract-css")
                .loader(mini_css_extract_plugin_1.default.loader)
                .options(miniCssOptions)
                .end();
        }
        else {
            cssRule
                .use("style-loader")
                .loader("style-loader")
                .end();
        }
        cssRule
            .use("css-loader")
            .loader("css-loader")
            .options({ ...cssLoaderOptions, importLoaders: 1 })
            .end()
            .use("postcss")
            .loader("postcss-loader")
            .options({ ...loaderOptions.postcss, sourceMap, ident: "postcss" })
            .end();
        if (createConfig.cssPreprocessor === "less") {
            const lessRule = webpackConfig.module.rule("less");
            lessRule.test(/\.less$/).end();
            if (extract) {
                lessRule
                    .use("extract-css")
                    .loader(mini_css_extract_plugin_1.default.loader)
                    .options(miniCssOptions)
                    .end();
            }
            else {
                lessRule
                    .use("style-loader")
                    .loader("style-loader")
                    .end();
            }
            lessRule
                .use("css-loader")
                .loader("css-loader")
                .options({
                ...cssLoaderOptions,
                sourceMap,
                importLoaders: 2,
                modules: {
                    localIdentName: "[local]-[hash:base64:5]",
                },
            })
                .end()
                .use("postcss-loader")
                .loader("postcss-loader")
                .options({ ...loaderOptions.postcss, sourceMap, ident: "postcss" })
                .end()
                .use("less-loader")
                .loader("less-loader")
                .options({ ...loaderOptions.less, sourceMap, noIeCompat: true })
                .end();
        }
        if (extract) {
            webpackConfig.plugin("extract-css").use(mini_css_extract_plugin_1.default, [extractOptions]);
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=css.js.map