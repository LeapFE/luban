"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(api, options) {
    const processors = [];
    const extendsConfig = [
        "stylelint-config-standard",
        "stylelint-config-prettier",
    ];
    let rules = {};
    let lintScript = "stylelint src/**/*.css";
    if (options.preset.cssPreprocessor === "styled-components") {
        processors.push([
            "stylelint-processor-styled-components",
            {
                moduleName: "styled-components",
                strict: false,
                ignoreFiles: ["**/*.css"],
            },
        ]);
        extendsConfig.push("stylelint-config-styled-components");
        api.extendPackage({
            devDependencies: {
                "stylelint-config-styled-components": "^0.1.1",
                "stylelint-processor-styled-components": "^1.8.0",
            },
            scripts: {
                "format:style": `prettier --write src/**/*.{css,css.${options.preset.language}}`,
                "format:check:style": `prettier --check src/**/*.{css,css.${options.preset.language}}`,
            },
        });
        lintScript = `stylelint src/**/*.{css,css.${options.preset.language}}`;
    }
    if (options.preset.cssPreprocessor === "less") {
        lintScript = "stylelint src/**/*.{css,less}";
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
        api.extendPackage({
            scripts: {
                "format:style": "prettier --write src/**/*.{css,less}",
                "format:check:style": "prettier --check src/**/*.{css,less}",
            },
        });
    }
    let lintStyleFileSuffix = "src/**/*.{css,less}";
    if (options.preset.cssPreprocessor === "styled-components") {
        if (options.preset.language === "js") {
            lintStyleFileSuffix = "src/**/*.{css,css.js}";
        }
        if (options.preset.language === "ts") {
            lintStyleFileSuffix = "src/**/*.{css,css.ts}";
        }
    }
    api.extendPackage({
        devDependencies: {
            stylelint: "^13.0.0",
            "stylelint-config-standard": "^19.0.0",
            "stylelint-config-prettier": "^6.0.0",
        },
        scripts: {
            stylelint: lintScript,
        },
    });
    if (api.isGitRepository()) {
        api.extendPackage({
            "lint-staged": {
                [lintStyleFileSuffix]: ["npm run eslint", "npm run format:check:style"],
            },
        });
    }
    api.render("./template", {
        processors: JSON.stringify(processors),
        extendsConfig: JSON.stringify(extendsConfig),
        rules: JSON.stringify(rules),
    });
}
exports.default = default_1;
//# sourceMappingURL=generator.js.map