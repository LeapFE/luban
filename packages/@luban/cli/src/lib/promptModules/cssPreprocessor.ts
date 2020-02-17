import { PromptModuleAPI } from "../promptModuleAPI";

export default function(cli: PromptModuleAPI): void {
  cli.injectPrompt({
    name: "cssPreprocessor",
    type: "list",
    message:
      "Pick a CSS pre-processor, and PostCSS, Autoprefixer and CSS Modules(for less) are supported by default",
    default: "less",
    choices: [
      {
        name: "Less",
        value: "less",
      },
      {
        name: "Styled-components",
        value: "styled-components",
      },
    ],
  });

  cli.onPromptComplete((answers, preset) => {
    preset.cssPreprocessor = answers.cssPreprocessor;
  });
}
