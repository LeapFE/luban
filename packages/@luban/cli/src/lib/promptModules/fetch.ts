import { PromptModuleAPI } from "../promptModuleAPI";

export default function(cli: PromptModuleAPI): void {
  cli.injectPrompt({
    type: "confirm",
    name: "fetch",
    default: true,
    message: "Built-in data fetching function with Axios",
  });

  cli.onPromptComplete((answers, preset) => {
    preset.stylelint = answers.fetch;
    if (answers.fetch) {
      preset.plugins["@luban-cli/cli-plugin-fetch"] = {};
    }
  });
}
