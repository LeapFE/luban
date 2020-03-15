"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(cli) {
    cli.injectPrompt({
        name: "unitTest",
        type: "confirm",
        default: true,
        message: "Add unit testing solution with Jest + Enzyme to test your components and others",
    });
    cli.onPromptComplete((answers, preset) => {
        preset.unitTest = answers.unitTest;
        if (answers.unitTest) {
            preset.plugins["@luban-cli/cli-plugin-unit-test"] = {};
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=unitTest.js.map