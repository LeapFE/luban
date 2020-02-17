"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(cli) {
    cli.injectPrompt({
        name: "unitTest",
        type: "confirm",
        default: true,
        message: "Add a Unit Testing solution with Jest?",
    });
    cli.onPromptComplete((answers, preset) => {
        preset.unitTest = answers.unitTest;
        if (answers.unitTest) {
            preset.plugins["@luban/cli-plugin-unit-test"] = {};
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=unit.js.map