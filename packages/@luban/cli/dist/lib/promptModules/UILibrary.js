"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(cli) {
    cli.injectPrompt({
        name: "uiLibrary",
        type: "checkbox",
        message: "Pick ant-design or ant-design-mobile to add your project",
        choices: [
            {
                name: "Ant-design",
                value: "ant-design",
            },
            {
                name: "Ant-design-mobile",
                value: "ant-design-mobile",
            },
        ],
    });
    cli.onPromptComplete((answers, preset) => {
        preset.uiLibrary = answers.uiLibrary;
    });
}
exports.default = default_1;
//# sourceMappingURL=UILibrary.js.map