"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(api, options) {
    api.extendPackage({
        scripts: {
            start: "npm run serve",
            serve: "luban-cli-service serve --open",
            build: "luban-cli-service build",
            inspect: "luban-cli-service inspect",
        },
    });
    const modifyFile = options.preset.language === "ts" ? "src/App.tsx" : "src/App.jsx";
    api.render("./template/service");
    api.extendPackage({
        dependencies: {
            react: "^16.12.0",
            "react-dom": "^16.12.0",
            "react-hot-loader": "^4.12.19",
        },
        devDependencies: {
            prettier: "^1.19.1",
            autoprefixer: "^9.7.1",
            cssnano: "^4.1.10",
            "postcss-preset-env": "^6.7.0",
            "css-loader": "^3.4.0",
            "file-loader": "^5.1.0",
            "postcss-loader": "^3.0.0",
            "url-loader": "^3.0.0",
            "style-loader": "^1.1.3",
        },
        browserslist: [
            "last 1 version",
            "> 1%",
            "maintained node versions",
            "not ie <= 10",
            "not dead",
        ],
    });
    if (options.preset.cssPreprocessor) {
        if (options.preset.cssPreprocessor === "less") {
            api.extendPackage({
                devDependencies: {
                    less: "^3.10.0",
                    "less-loader": "^5.0.0",
                },
            });
        }
        if (options.preset.cssPreprocessor === "styled-components") {
            api.extendPackage({
                dependencies: {
                    "styled-components": "^4.4.0",
                },
            });
        }
        if (options.preset.cssPreprocessor === "less" && options.preset.language === "js") {
            api.render("./template/JSLess", { modifyFile });
        }
        if (options.preset.cssPreprocessor === "less" && options.preset.language === "ts") {
            api.render("./template/TSLess", { modifyFile });
        }
        if (options.preset.cssPreprocessor === "styled-components" &&
            options.preset.language === "js") {
            api.render("./template/JSstyledComponents", { modifyFile });
        }
        if (options.preset.cssPreprocessor === "styled-components" &&
            options.preset.language === "ts") {
            api.render("./template/TSstyledComponents", { modifyFile });
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=generator.js.map