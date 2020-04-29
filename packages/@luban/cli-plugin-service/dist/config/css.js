"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
function default_1(api, options) {
    api.chainWebpack((webpackConfig) => {
        const isProduction = process.env.NODE_ENV === "production";
        const createConfig = api.resolveInitConfig();
        const { css: { extract = isProduction, sourceMap = !isProduction, loaderOptions }, } = options;
        const filename = `${options.assetsDir.styles}/[name]${isProduction ? ".[hash:8]" : ""}.css`;
        const chunkFilename = `${options.assetsDir.styles}/[name]${isProduction ? ".[chunkhash:8]" : ""}.css`;
        const extractOptions = {
            filename,
            chunkFilename,
        };
        const miniCssOptions = {
            hmr: !isProduction,
            reloadAll: !isProduction,
            ...loaderOptions.miniCss,
        };
        const cssLoaderOptions = {
            sourceMap,
            ...loaderOptions.css,
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
            .options({ importLoaders: 1, ...cssLoaderOptions })
            .end()
            .use("postcss")
            .loader("postcss-loader")
            .options({ sourceMap, ident: "postcss", ...loaderOptions.postcss })
            .end();
        if (createConfig.cssSolution === "less") {
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
                sourceMap,
                importLoaders: 1,
                modules: {
                    mode: "global",
                    exportGlobals: true,
                    localIdentName: "[name]__[local]__[hash:base64:5]",
                    context: api.service.context,
                },
                ...cssLoaderOptions,
            })
                .end()
                .use("postcss-loader")
                .loader("postcss-loader")
                .options({ sourceMap, ident: "postcss", ...loaderOptions.postcss })
                .end()
                .use("less-loader")
                .loader("less-loader")
                .options({ sourceMap, noIeCompat: true, ...loaderOptions.less })
                .end();
        }
        if (extract) {
            webpackConfig.plugin("extract-css").use(mini_css_extract_plugin_1.default, [extractOptions]);
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=css.js.map