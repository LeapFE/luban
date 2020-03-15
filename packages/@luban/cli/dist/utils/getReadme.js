"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scriptsNameDescriptions = {
    start: "alias of serve",
    build: "Compiles and minifies for production",
    serve: "Compiles and hot-reloads for development",
    eslint: "Find problems in you code",
    "eslint:fix": "Fix problems in you code",
    stylelint: "Find problems in you style code",
    inspect: "Inspect webpack config is specify [mode]",
    test: "Run all unit tests",
    "test:update": "Re-record every snapshot that fails during this test run",
    "test:coverage": "Indicates that test coverage information should be collected and reported in the output",
};
function printScripts(pkg, packageManager) {
    return Object.keys(pkg.scripts || {})
        .map((key) => {
        if (!scriptsNameDescriptions[key])
            return "";
        return [
            `\n### ${scriptsNameDescriptions[key]}`,
            "```",
            `${packageManager} run ${key}`,
            "```",
            "",
        ].join("\n");
    })
        .join("");
}
exports.generateReadme = function (pkg, packageManager) {
    return [
        `# ${pkg.name}\n`,
        `> ${pkg.description}`,
        "## Project setup",
        "```",
        `${packageManager} install`,
        "```",
        printScripts(pkg, packageManager),
    ].join("\n");
};
//# sourceMappingURL=getReadme.js.map