"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stylelint_webpack_plugin_1 = __importDefault(require("stylelint-webpack-plugin"));
const path_1 = require("path");
function default_1(api) {
    api.chainWebpack((webpackConfig) => {
        webpackConfig.plugin("style-lint-plugin").use(stylelint_webpack_plugin_1.default, [
            {
                files: ["**/*.css", "**/*.css.js", "**/*.less", "**/*.css.ts"],
                emitErrors: true,
                context: api.resolve("src"),
                configFile: path_1.join(api.service.context, ".stylelintrc"),
            },
        ]);
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map