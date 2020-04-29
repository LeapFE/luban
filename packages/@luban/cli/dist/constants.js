"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPreset = {
    language: "ts",
    eslint: "leap",
    cssSolution: "less",
    stylelint: true,
    router: true,
    store: true,
    unitTest: true,
    fetch: true,
    plugins: {
        "@luban-cli/cli-plugin-service": {},
        "@luban-cli/cli-plugin-babel": {},
        "@luban-cli/cli-plugin-eslint": {},
        "@luban-cli/cli-plugin-router": {},
        "@luban-cli/cli-plugin-store": {},
        "@luban-cli/cli-plugin-stylelint": {},
        "@luban-cli/cli-plugin-typescript": {},
        "@luban-cli/cli-plugin-unit-test": {},
        "@luban-cli/cli-plugin-fetch": {},
    },
};
exports.defaultPresetNameMap = {
    language: "development language",
    eslint: "eslint config",
    cssSolution: "css solution",
    stylelint: "use stylelint",
    router: "use router(based on React-Router)",
    store: "use centralized store(based on rematch)",
    unitTest: "use unit testing(based on Jest + Enzyme)",
    fetch: "built-in data fetching(based on Axios)",
};
exports.defaultPromptModule = [
    "language",
    "eslint",
    "cssSolution",
    "stylelint",
    "router",
    "store",
    "unitTest",
    "fetch",
];
exports.defaultRootOptions = {
    projectName: "",
    preset: exports.defaultPreset,
};
exports.confirmUseDefaultPresetMsg = "Will use default preset create project? \n" +
    "  (if you want to specify custom features with project, " +
    "cancel current operation and use `luban init <project_directory> -m` to create project)";
//# sourceMappingURL=constants.js.map