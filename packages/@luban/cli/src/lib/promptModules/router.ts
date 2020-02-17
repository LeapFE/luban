import { PromptModuleAPI } from "../promptModuleAPI";

export default function(cli: PromptModuleAPI): void {
  cli.injectPrompt({
    name: "router",
    type: "confirm",
    default: true,
    message: "Use Router to build the app with dynamic pages?",
  });

  cli.onPromptComplete((answers, preset) => {
    preset.router = answers.router;
    if (answers.router) {
      preset.plugins["@luban/cli-plugin-router"] = {};
    }
  });
};
