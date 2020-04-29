"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseConfigList = [
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
];
function default_1(cli) {
    cli.injectPrompt({
        name: "eslint",
        type: "list",
        message: "Pick a linter config:",
        default: (answer) => (answer.language === "js" ? "airbnb" : "leap"),
        choices: (answer) => {
            if (answer.language === "js") {
                return baseConfigList;
            }
            return [
                {
                    name: "ESLint + Leap config",
                    value: "leap",
                    short: "Leap",
                },
            ].concat(baseConfigList);
        },
    });
    cli.onPromptComplete((answers, preset) => {
        preset.eslint = answers.eslint;
        preset.plugins["@luban-cli/cli-plugin-eslint"] = {};
    });
}
exports.default = default_1;
//# sourceMappingURL=eslint.js.map