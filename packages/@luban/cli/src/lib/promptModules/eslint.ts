import { PromptModuleAPI } from "../promptModuleAPI";

const baseConfigList = [
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
];

export default function(cli: PromptModuleAPI): void {
  // Checking code errors and enforcing an unitive code style is recommended.
  cli.injectPrompt({
    name: "eslint",
    type: "list",
    message: "Pick a linter config:",

    // REVIEW
    // answer: { language: "js" | "ts" }
    default: (answer: any) => (answer.language === "js" ? "airbnb" : "leap"),

    // answer: { language: "js" | "ts" }
    choices: (answer) => {
      if (answer.language === "js") {
        return baseConfigList;
      }

      return [
        {
          name: "ESLint + Leap config",
          value: "leap",
          short: "Leap",
        },
      ].concat(baseConfigList);
    },
  });

  cli.onPromptComplete((answers, preset) => {
    preset.eslint = answers.eslint;
    preset.plugins["@luban-cli/cli-plugin-eslint"] = {};
  });
}
