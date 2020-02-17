"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(api, options) {
    const processors = [];
    const extendsConfig = [
        "stylelint-config-standard",
        "stylelint-config-prettier",
    ];
    let rules = {};
    let lintScript = "stylelint src/*.css src/**/*.css";
    const isTSProject = !!options.preset.plugins["cli-plugin-typescript"];
    if (options.preset.cssPreprocessor === "styled-components") {
        processors.push([
            "stylelint-processor-styled-components",
            {
                moduleName: "styled-components",
                strict: false,
                ignoreFiles: ["**/*.css"],
            },
        ]);
        if (isTSProject) {
            lintScript = "stylelint src/*.css src/*.css.ts src/**/*.css src/**/*.css.ts";
        }
        else {
            lintScript = "stylelint src/*.css src/*.css.js src/**/*.css src/**/*.css.js";
        }
    }
    if (options.preset.cssPreprocessor === "styled-components") {
        extendsConfig.push("stylelint-config-styled-components");
    }
    if (options.preset.cssPreprocessor === "less") {
        lintScript = "stylelint src/*.css src/*.less src/**/*.css src/**/*.less";
        rules = {
            "block-closing-brace-empty-line-before": null,
            "block-closing-brace-newline-after": null,
            "block-closing-brace-newline-before": null,
            "block-closing-brace-space-before": null,
            "block-opening-brace-newline-after": null,
            "block-opening-brace-space-after": null,
            "block-opening-brace-space-before": null,
            "declaration-block-semicolon-newline-after": null,
            "declaration-block-semicolon-space-after": null,
            "declaration-block-semicolon-space-before": null,
            "declaration-block-trailing-semicolon": null,
            "declaration-colon-space-after": null,
            "declaration-block-single-line-max-declarations": null,
            "selector-list-comma-newline-after": null,
        };
    }
    api.extendPackage({
        devDependencies: {
            stylelint: "^12.0.0",
            "stylelint-config-standard": "^19.0.0",
            "stylelint-config-styled-components": "^0.1.1",
            "stylelint-processor-styled-components": "^1.8.0",
            "stylelint-config-prettier": "^6.0.0",
        },
        scripts: {
            stylelint: lintScript,
        },
    });
    api.render("./../../../template/stylelint", {
        processors: JSON.stringify(processors),
        extendsConfig: JSON.stringify(extendsConfig),
        rules: JSON.stringify(rules),
    });
}
exports.default = default_1;
//# sourceMappingURL=generator.js.map