import { PromptModuleAPI } from "../promptModuleAPI";

export default function(cli: PromptModuleAPI): void {
  // select development language
  cli.injectPrompt({
    name: "language",
    type: "list",
    message: "Pick JavaScript or TypeScript to development your project",
    default: "ts",
    choices: [
      {
        name: "TypeScript",
        value: "ts",
      },
      {
        name: "JavaScript",
        value: "js",
      },
    ],
  });

  cli.onPromptComplete((answers, preset) => {
    preset.language = answers.language;
    if (answers.language === "js") {
      preset.plugins["@luban-cli/cli-plugin-babel"] = {};
    }

    if (answers.language === "ts") {
      preset.plugins["@luban-cli/cli-plugin-babel"] = {};
      preset.plugins["@luban-cli/cli-plugin-typescript"] = {};
    }
  });
}
