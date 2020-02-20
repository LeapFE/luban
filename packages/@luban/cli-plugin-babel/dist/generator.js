"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(api, rootOptions) {
    const babelConfigPreset = [
        ["@babel/preset-env", { useBuiltIns: "usage", corejs: { version: 3, proposals: true } }],
        "@babel/preset-react",
    ];
    const babelConfigPlugins = [
        "react-hot-loader/babel",
        "@babel/plugin-transform-runtime",
    ];
    let babelConfigEnv = {};
    api.extendPackage({
        devDependencies: {
            "@babel/cli": "^7.7.0",
            "@babel/core": "^7.7.2",
            "@babel/plugin-transform-runtime": "^7.6.2",
            "@babel/preset-env": "^7.7.1",
            "@babel/runtime": "^7.7.2",
            "@babel/preset-react": "^7.7.0",
            "core-js": "^3.4.2",
        },
    });
    if (rootOptions.preset.language === "ts") {
        babelConfigPreset.push("@babel/preset-typescript");
    }
    if (rootOptions.preset.language === "js") {
        babelConfigPlugins.push("@babel/plugin-proposal-object-rest-spread", "@babel/plugin-proposal-class-properties");
        api.extendPackage({
            devDependencies: {
                "@babel/plugin-proposal-class-properties": "^7.7.0",
                "@babel/plugin-proposal-object-rest-spread": "^7.6.2",
            },
        });
    }
    if (rootOptions.preset.cssPreprocessor === "styled-components") {
        babelConfigPlugins.push([
            "babel-plugin-styled-components",
            {
                displayName: true,
                fileName: false,
                minify: true,
                pure: true,
            },
        ]);
        api.extendPackage({
            devDependencies: {
                "babel-plugin-styled-components": "^1.10.0",
            },
        });
    }
    if (rootOptions.preset.eslint && rootOptions.preset.language === "js") {
        api.extendPackage({
            devDependencies: {
                "babel-plugin-transform-react-remove-prop-types": "^0.4.24",
            },
        });
        babelConfigEnv = {
            production: {
                plugins: ["transform-react-remove-prop-types"],
            },
        };
    }
    api.render("./template", {
        presets: JSON.stringify(babelConfigPreset),
        plugins: JSON.stringify(babelConfigPlugins),
        env: JSON.stringify(babelConfigEnv),
    });
}
exports.default = default_1;
//# sourceMappingURL=generator.js.map