import { PromptModuleAPI } from "../promptModuleAPI";

export default function (cli: PromptModuleAPI): void {
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
