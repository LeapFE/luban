import { SUPPORTED_PACKAGE_MANAGER, BasePkgFields } from "../definitions";

const descriptions = {
  start: "alias of serve",
  build: "Compiles and minifies for production",
  serve: "Compiles and hot-reloads for development",
  eslint: "find problems in you code",
  "eslint:fix": "fix problems in you code",
  stylelint: "find problems in you style code",
  inspect: "inspect webpack config is specify [mode]",
};

function printScripts(pkg: BasePkgFields, packageManager: SUPPORTED_PACKAGE_MANAGER): string {
  return Object.keys(pkg.scripts || {})
    .map((key) => {
      if (!descriptions[key]) return "";
      return [`\n### ${descriptions[key]}`, "```", `${packageManager} run ${key}`, "```", ""].join(
        "\n",
      );
    })
    .join("");
}

export const generateReadme = function(
  pkg: BasePkgFields,
  packageManager: SUPPORTED_PACKAGE_MANAGER,
): string {
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
