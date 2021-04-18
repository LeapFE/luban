import { PromptModuleAPI } from "../promptModuleAPI";

export default function (cli: PromptModuleAPI): void {
  cli.injectPrompt({
    type: "confirm",
    name: "commit",
    default: true,
    message: "commit with commitizen and lint commit messages by commitlint",
  });

  cli.onPromptComplete((answers, preset) => {
    preset.commit = answers.commit;
    if (answers.commit) {
      preset.plugins["@luban-cli/cli-plugin-commit"] = {};
    }
  });
}
