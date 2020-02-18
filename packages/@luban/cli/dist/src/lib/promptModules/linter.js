"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(cli) {
    cli.injectPrompt({
        name: "eslint",
        type: "list",
        message: "Pick a linter config:",
        default: "standard",
        choices: () => [
            {
                name: "ESLint + Basic config",
                value: "base",
                short: "Basic",
            },
            {
                name: "ESLint + Standard config",
                value: "standard",
                short: "Standard",
            },
            {
                name: "ESLint + Airbnb config",
                value: "airbnb",
                short: "Airbnb",
            },
        ],
    });
    cli.onPromptComplete((answers, preset) => {
        preset.eslint = answers.eslint;
        preset.plugins["@luban-cli/cli-plugin-eslint"] = {};
    });
}
exports.default = default_1;
//# sourceMappingURL=linter.js.map