"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(cli) {
    cli.injectPrompt({
        name: "cssSolution",
        type: "list",
        message: "Pick a CSS Solution, and PostCSS, Autoprefixer and CSS Modules(for less) are supported by default",
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
        preset.cssSolution = answers.cssSolution;
    });
}
exports.default = default_1;
//# sourceMappingURL=cssSolution.js.map