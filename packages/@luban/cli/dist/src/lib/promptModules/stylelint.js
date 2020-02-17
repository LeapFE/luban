"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(cli) {
    cli.injectPrompt({
        type: "confirm",
        name: "stylelint",
        default: true,
        message: "Use stylelint check and enforce stylesheet code quality",
    });
    cli.onPromptComplete((answers, preset) => {
        preset.stylelint = answers.stylelint;
        if (answers.stylelint) {
            preset.plugins["@luban/cli-plugin-stylelint"] = {};
        }
    });
}
exports.default = default_1;
;
//# sourceMappingURL=stylelint.js.map