"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(cli) {
    cli.injectPrompt({
        name: "cssPreprocessor",
        type: "list",
        message: "Pick a CSS pre-processor, and PostCSS, Autoprefixer and CSS Modules(for less) are supported by default",
        default: "less",
        choices: [
            {
                name: "Less",
                value: "less",
            },
            {
                name: "Styled-components",
                value: "styled-components",
            },
        ],
    });
    cli.onPromptComplete((answers, preset) => {
        preset.cssPreprocessor = answers.cssPreprocessor;
    });
}
exports.default = default_1;
//# sourceMappingURL=cssPreprocessor.js.map