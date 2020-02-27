"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(cli) {
    cli.injectPrompt({
        name: "store",
        type: "confirm",
        default: true,
        message: "Manage the app state with a centralized store",
    });
    cli.onPromptComplete((answers, preset) => {
        preset.store = answers.store;
        if (answers.store) {
            preset.plugins["@luban-cli/cli-plugin-store"] = {};
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=store.js.map