"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const descriptions = {
    start: "alias of serve",
    build: "Compiles and minifies for production",
    serve: "Compiles and hot-reloads for development",
    eslint: "find problems in you code",
    "eslint:fix": "fix problems in you code",
    stylelint: "find problems in you style code",
    inspect: "inspect webpack config is specify [mode]",
};
function printScripts(pkg, packageManager) {
    return Object.keys(pkg.scripts || {})
        .map((key) => {
        if (!descriptions[key])
            return "";
        return [`\n### ${descriptions[key]}`, "```", `${packageManager} run ${key}`, "```", ""].join("\n");
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