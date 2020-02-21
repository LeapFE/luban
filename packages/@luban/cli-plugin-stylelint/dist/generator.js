"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_shared_utils_1 = require("@luban-cli/cli-shared-utils");
function default_1(api, options) {
    const processors = [];
    const extendsConfig = [
        "stylelint-config-standard",
        "stylelint-config-prettier",
    ];
    const stylelintRules = new cli_shared_utils_1.SimpleMapPolyfill([
        ["comment-empty-line-before", ["always"]],
        [
            "rule-empty-line-before",
            [
                "always",
                {
                    ignore: ["after-comment", "first-nested"],
                },
            ],
        ],
    ]);
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
                "stylelint-processor-styled-components": "^1.10.0",
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
        stylelintRules.set("selector-pseudo-class-no-unknown", [
            true,
            {
                ignorePseudoClasses: ["export", "import", "global", "local", "external"],
            },
        ]);
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
            "stylelint-config-prettier": "^8.0.1",
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
        stylelintRules: JSON.stringify(stylelintRules.toPlainObject()),
    });
}
exports.default = default_1;
//# sourceMappingURL=generator.js.map