import { PromptModuleAPI } from "../promptModuleAPI";

export default function(cli: PromptModuleAPI): void {
  // Checking code errors and enforcing an unitive code style is recommended.
  cli.injectPrompt({
    name: "eslint",
    type: "list",
    message: "Pick a linter config:",
    default: "standard",
    choices: () => [
      {
        name: "ESLint + Basic config",
        value: "base",
        short: "Basic",
      },
      {
        name: "ESLint + Standard config",
        value: "standard",
        short: "Standard",
      },
      {
        name: "ESLint + Airbnb config",
        value: "airbnb",
        short: "Airbnb",
      },
    ],
  });

  cli.onPromptComplete((answers, preset) => {
    preset.eslint = answers.eslint;
    preset.plugins["@luban-cli/cli-plugin-eslint"] = {};
  });
}
