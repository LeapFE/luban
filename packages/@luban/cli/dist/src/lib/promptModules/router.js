"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(cli) {
    cli.injectPrompt({
        name: "router",
        type: "confirm",
        default: true,
        message: "Use Router to build the app with dynamic pages?",
    });
    cli.onPromptComplete((answers, preset) => {
        preset.router = answers.router;
        if (answers.router) {
            preset.plugins["@luban/cli-plugin-router"] = {};
        }
    });
}
exports.default = default_1;
;
//# sourceMappingURL=router.js.map