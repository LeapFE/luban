import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/lib/generator/generatorAPI";
import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

import { eslintConfigLeap } from "./leap";
import { eslintConfigAirbnb } from "./airbnb";
import { eslintConfigStandard } from "./standard";

export default function (api: GeneratorAPI, options: Required<RootOptions>): void {
  const lintFileSuffix = "{ts,tsx}";

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
        [`src/**/*.${lintFileSuffix}`]: ["npm run eslint", `npm run format:check:ts`],
      },
    });
  }

  if (options.eslint === "leap") {
    eslintConfigLeap(api, options);
    return;
  }

  if (options.eslint === "airbnb") {
    eslintConfigAirbnb(api, options);
    return;
  }

  if (options.eslint === "standard") {
    eslintConfigStandard(api, options);
    return;
  }
}
