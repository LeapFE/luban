"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(cli) {
    cli.injectPrompt({
        name: "eslint",
        type: "list",
        message: "Pick a linter config:",
        default: "airbnb",
        choices: () => [
            {
                name: "ESLint + Airbnb config",
                value: "airbnb",
                short: "Airbnb",
            },
            {
                name: "ESLint + Standard config",
                value: "standard",
                short: "Standard",
            },
        ],
    });
    cli.onPromptComplete((answers, preset) => {
        preset.eslint = answers.eslint;
        preset.plugins["@luban-cli/cli-plugin-eslint"] = {};
    });
}
exports.default = default_1;
//# sourceMappingURL=eslint.js.map