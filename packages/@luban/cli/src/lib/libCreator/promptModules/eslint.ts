import { LibPromptModuleAPI } from "../promptModuleAPI";

export default function(cli: LibPromptModuleAPI): void {
  // Checking code errors and enforcing an unitive code style is recommended.
  cli.injectPrompt({
    name: "eslint",
    type: "list",
    message: "Pick a linter config:",

    default: "leap",

    choices: [
      {
        name: "ESLint + Leap config",
        value: "leap",
        short: "Leap",
      },
      {
        name: "ESLint + Airbnb config",
        value: "airbnb",
        short: "Airbnb",
      },
      {
        name: "ESLint + Standard config",
        value: "standard",
        short: "Standard",
      },
    ],
  });

  cli.onPromptComplete((answers, preset) => {
    preset.eslint = answers.eslint;
    preset.plugins["@luban-cli/cli-plugin-eslint"] = {};
  });
}
