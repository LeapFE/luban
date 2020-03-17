"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(cli) {
    cli.injectPrompt({
        type: "confirm",
        name: "fetch",
        default: true,
        message: "Built-in data fetching function with Axios",
    });
    cli.onPromptComplete((answers, preset) => {
        preset.stylelint = answers.fetch;
        if (answers.fetch) {
            preset.plugins["@luban-cli/cli-plugin-fetch"] = {};
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=fetch.js.map