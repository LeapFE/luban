"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(cli) {
    cli.injectPrompt({
        name: "language",
        type: "list",
        message: "Pick JavaScript or TypeScript to development your project",
        default: "ts",
        choices: [
            {
                name: "TypeScript",
                value: "ts",
            },
            {
                name: "JavaScript",
                value: "js",
            },
        ],
    });
    cli.onPromptComplete((answers, preset) => {
        preset.language = answers.language;
        if (answers.language === "js") {
            preset.plugins["@luban-cli/cli-plugin-babel"] = {};
        }
        if (answers.language === "ts") {
            preset.plugins["@luban-cli/cli-plugin-babel"] = {};
            preset.plugins["@luban-cli/cli-plugin-typescript"] = {};
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=language.js.map