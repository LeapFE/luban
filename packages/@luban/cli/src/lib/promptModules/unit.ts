import { PromptModuleAPI } from "../promptModuleAPI";

export default function(cli: PromptModuleAPI): void {
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
