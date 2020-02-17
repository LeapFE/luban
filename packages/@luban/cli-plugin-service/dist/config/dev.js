"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const fs_1 = require("fs");
const cli_shared_utils_1 = require("@luban/cli-shared-utils");
const resolveClientEnv_1 = require("./../utils/resolveClientEnv");
function default_1(api, options) {
    api.chainWebpack((webpackConfig) => {
        const isProduction = process.env.NODE_ENV === "production";
        const outputDir = api.resolve(options.outputDir);
        webpackConfig.output
            .path(outputDir)
            .filename("[name]-[hash:8].js")
            .end();
        const htmlPath = api.resolve("template/index.html");
        if (!fs_1.existsSync(htmlPath)) {
            cli_shared_utils_1.error("The template html file not exit, please check it");
            process.exit();
        }
        const htmlPluginOptions = {
            template: htmlPath,
            templateParameters: resolveClientEnv_1.resolveClientEnv(options, true),
            minify: isProduction
                ? {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                }
                : false,
        };
        webpackConfig.plugin("html").use(html_webpack_plugin_1.default, [htmlPluginOptions]);
    });
}
exports.default = default_1;
//# sourceMappingURL=dev.js.map