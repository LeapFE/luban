"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_shared_utils_1 = require("@luban-cli/cli-shared-utils");
const schema = cli_shared_utils_1.createSchema((joi) => joi.object({
    publicPath: joi.string(),
    outputDir: joi.string(),
    indexPath: joi.string(),
    assetsDir: joi.object({
        scripts: joi.string(),
        styles: joi.string(),
        images: joi.string(),
        media: joi.string(),
        fonts: joi.string(),
    }),
    productionSourceMap: joi.boolean(),
    css: joi.object({
        modules: joi.boolean(),
        extract: joi.boolean(),
        sourceMap: joi.boolean(),
        loaderOptions: joi.object({
            less: joi.object(),
            css: joi.object(),
            miniCss: joi.object(),
            postcss: joi.object(),
        }),
    }),
    devServer: joi.object(),
    alias: joi.object(),
    assetsLimit: joi.number(),
}));
function validateProjectConfig(options) {
    cli_shared_utils_1.validate(options, schema, { allowUnknown: true });
}
exports.validateProjectConfig = validateProjectConfig;
exports.defaultsProjectConfig = {
    publicPath: "/",
    outputDir: "dist",
    assetsDir: {
        scripts: "scripts",
        styles: "styles",
        images: "images",
        fonts: "fonts",
        media: "media",
    },
    indexPath: "index.html",
    templatePath: "index.html",
    productionSourceMap: false,
    css: {
        extract: undefined,
        sourceMap: undefined,
        loaderOptions: {
            css: {},
            less: {},
            miniCss: {},
            postcss: {},
        },
    },
    assetsLimit: 4096,
    alias: {},
    devServer: {},
};
//# sourceMappingURL=options.js.map