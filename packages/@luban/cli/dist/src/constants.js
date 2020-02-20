"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPreset = {
    language: "ts",
    eslint: "standard",
    cssPreprocessor: "less",
    stylelint: true,
    router: true,
    store: true,
    unitTest: true,
    uiLibrary: [],
    plugins: {
        "@luban-cli/cli-plugin-service": {},
        "@luban-cli/cli-plugin-babel": {},
        "@luban-cli/cli-plugin-eslint": {},
        "@luban-cli/cli-plugin-router": {},
        "@luban-cli/cli-plugin-store": {},
        "@luban-cli/cli-plugin-stylelint": {},
        "@luban-cli/cli-plugin-typescript": {},
        "@luban-cli/cli-plugin-unit-test": {},
    },
};
exports.defaultRootOptions = {
    projectName: "",
    preset: exports.defaultPreset,
};
exports.confirmUseDefaultPresetMsg = "Will use default preset create project? \n" +
    "  (if you want to specify custom features with project, " +
    "cancel current operation and use `luban init <project_directory> -m` to create project)";
//# sourceMappingURL=constants.js.map