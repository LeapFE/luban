import { PromptModuleAPI } from "../promptModuleAPI";

export default function(cli: PromptModuleAPI): void {
  cli.injectPrompt({
    name: "store",
    type: "confirm",
    default: true,
    message: "Manage the app state with a centralized store",
  });

  cli.onPromptComplete((answers, preset) => {
    preset.store = answers.store;
    if (answers.store) {
      preset.plugins["@luban-cli/cli-plugin-store"] = {};
    }
  });
}
