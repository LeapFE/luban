import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/lib/generatorAPI";
import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

import { eslintConfigLeap } from "./leap";
import { eslintConfigAirbnb } from "./airbnb";
import { eslintConfigStandard } from "./standard";

export default function(api: GeneratorAPI, options: Required<RootOptions>): void {
  const lintFileSuffix = options.preset.language === "ts" ? "{ts,tsx}" : "{js,jsx}";

  if (api.isGitRepository()) {
    api.extendPackage({
      devDependencies: {
        husky: "^3.0.9",
        "lint-staged": "^9.4.3",
      },
      husky: {
        hooks: {
          "pre-commit": "lint-staged",
        },
      },
      "lint-staged": {
        [`src/**/*.${lintFileSuffix}`]: [
          "npm run eslint",
          `npm run format:check:${options.preset.language}`,
        ],
      },
    });
  }

  if (options.preset.eslint === "leap") {
    eslintConfigLeap(api);
    return;
  }

  if (options.preset.eslint === "airbnb") {
    eslintConfigAirbnb(api, options);
    return;
  }

  if (options.preset.eslint === "standard") {
    eslintConfigStandard(api, options);
    return;
  }
}
