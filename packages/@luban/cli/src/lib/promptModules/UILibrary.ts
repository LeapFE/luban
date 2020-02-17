import { PromptModuleAPI } from "../promptModuleAPI";

/**
 * @unsupported
 */
export default function(cli: PromptModuleAPI): void {
  cli.injectPrompt({
    name: "uiLibrary",
    type: "checkbox",
    message: "Pick ant-design or ant-design-mobile to add your project",
    choices: [
      {
        name: "Ant-design",
        value: "ant-design",
      },
      {
        name: "Ant-design-mobile",
        value: "ant-design-mobile",
      },
    ],
  });

  cli.onPromptComplete((answers, preset) => {
    preset.uiLibrary = answers.uiLibrary;
  });
}
