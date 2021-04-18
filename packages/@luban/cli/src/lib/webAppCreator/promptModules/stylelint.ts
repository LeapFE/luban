import { PromptModuleAPI } from "../promptModuleAPI";

export default function (cli: PromptModuleAPI): void {
  cli.injectPrompt({
    type: "confirm",
    name: "stylelint",
    default: true,
    message: "Use stylelint check and enforce stylesheet code quality",
  });

  cli.onPromptComplete((answers, preset) => {
    preset.stylelint = answers.stylelint;
    if (answers.stylelint) {
      preset.plugins["@luban-cli/cli-plugin-stylelint"] = {};
    }
  });
}
