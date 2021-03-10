import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/lib/generator/generatorAPI";
import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

import { SimpleMapPolyfill } from "@luban-cli/cli-shared-utils";

export function eslintConfigLeap(api: GeneratorAPI, options: Required<RootOptions>): void {
  const sourceDir = options.isLib ? "components" : "src";

  const eslintParser = "@typescript-eslint/parser";

  const parserOptions = new SimpleMapPolyfill<
    string,
    string | number | Record<string, unknown> | Array<string | Record<string, unknown>>
  >([["project", ["./tsconfig.json"]]]);

  const eslintExtends = ["leap"];

  const eslintEnv = new SimpleMapPolyfill<string, boolean>([["es2017", true]]);

  api.extendPackage({
    scripts: {
      eslint: `eslint --config .eslintrc --ext .tsx,.ts ${sourceDir}/`,
      "eslint:fix": `eslint --fix --config .eslintrc --ext .tsx,.ts ${sourceDir}/`,
      "format:ts": `prettier --write '${sourceDir}/**/*.{ts,tsx}'`,
      "format:check:ts": `prettier --check '${sourceDir}/**/*.{ts,tsx}'`,
    },
    devDependencies: {
      eslint: "^6.8.0",
      "eslint-loader": "^3.0.3",
      // TODO update version
      "eslint-config-leap": "^1.0.0",
      "eslint-config-prettier": "^6.10.0",
      "eslint-plugin-react": "^7.16.0",
      "eslint-plugin-react-hooks": "^2.4.0",
      "eslint-plugin-import": "^2.18.2",
      "eslint-plugin-promise": "^4.2.1",
      "@typescript-eslint/parser": "^2.30.0",
      "@typescript-eslint/eslint-plugin": "^2.30.0",
    },
  });

  api.render("./template/leap", {
    eslintExtends: JSON.stringify(eslintExtends),
    parserOptions: JSON.stringify(parserOptions.toPlainObject()),
    eslintParser: JSON.stringify(eslintParser),
    eslintEnv: JSON.stringify(eslintEnv.toPlainObject()),
  });
}
