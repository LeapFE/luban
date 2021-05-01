import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/lib/generator/generatorAPI";
import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

import { SimpleMapPolyfill } from "@luban-cli/cli-shared-utils";

export function eslintConfigLeap(api: GeneratorAPI, options: Required<RootOptions>): void {
  const sourceDir = options.type === "lib" ? "components" : "src";

  const eslintParser = "@typescript-eslint/parser";

  const parserOptions = new SimpleMapPolyfill<
    string,
    string | number | Record<string, unknown> | Array<string | Record<string, unknown>>
  >([["project", ["./tsconfig.json"]]]);

  const eslintExtends = ["leapfe"];

  const eslintEnv = new SimpleMapPolyfill<string, boolean>([["es2017", true]]);

  api.extendPackage({
    scripts: {
      eslint: `eslint --config .eslintrc --ext .tsx,.ts ${sourceDir}/`,
      "eslint:fix": `eslint --fix --config .eslintrc --ext .tsx,.ts ${sourceDir}/`,
      "format:ts": `prettier --write '${sourceDir}/**/*.{ts,tsx}'`,
      "format:check:ts": `prettier --check '${sourceDir}/**/*.{ts,tsx}'`,
    },
    devDependencies: {
      eslint: "^7.24.0",
      "eslint-config-leapfe": "^2.0.4",
      "eslint-config-prettier": "^8.2.0",
      "eslint-plugin-react": "^7.23.2",
      "eslint-plugin-react-hooks": "^4.2.0",
      "eslint-plugin-import": "^2.22.1",
      "eslint-plugin-promise": "^5.1.0",
      "@typescript-eslint/parser": "^4.22.0",
      "@typescript-eslint/eslint-plugin": "^4.22.0",
    },
  });

  if (options.type === "web") {
    api.extendPackage({
      devDependencies: {
        "eslint-webpack-plugin": "^2.5.4",
      },
    });
  }

  api.render("./template/leap", {
    eslintExtends: JSON.stringify(eslintExtends),
    parserOptions: JSON.stringify(parserOptions.toPlainObject()),
    eslintParser: JSON.stringify(eslintParser),
    eslintEnv: JSON.stringify(eslintEnv.toPlainObject()),
  });
}
