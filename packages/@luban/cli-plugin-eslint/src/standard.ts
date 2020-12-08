import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/lib/generator/generatorAPI";
import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

import { SimpleMapPolyfill } from "@luban-cli/cli-shared-utils";

export function eslintConfigStandard(api: GeneratorAPI, options: Required<RootOptions>): void {
  const eslintParser = options.language === "ts" ? "@typescript-eslint/parser" : "babel-eslint";

  const lintFileSuffix = options.language === "ts" ? "{ts,tsx}" : "{js,jsx}";

  const parserOptions = new SimpleMapPolyfill<
    string,
    string | number | Record<string, unknown> | Array<string | Record<string, unknown>>
  >([
    ["ecmaVersion", 2018],
    ["sourceType", "module"],
    [
      "ecmaFeatures",
      {
        jsx: true,
      },
    ],
  ]);

  const eslintRules = new SimpleMapPolyfill<
    string,
    string | Array<string | Record<string, unknown>>
  >([
    ["quotes", ["error", "double"]],
    ["semi", ["error", "always"]],
    ["react/prop-types", ["error"]],
    ["space-before-function-paren", ["error", "never"]],
    ["comma-dangle", ["error", "always-multiline"]],
    ["max-len", ["error", { code: 100, ignoreUrls: true, ignoreComments: true }]],
    ["arrow-body-style", "off"],
    ["object-curly-newline", "off"],
    ["indent", "off"],
    ["camelcase", "off"],
    ["operator-linebreak", "off"],
  ]);

  const eslintEnv = new SimpleMapPolyfill<string, boolean>([
    ["browser", true],
    ["es2017", true],
  ]);

  const eslintSettings = new SimpleMapPolyfill<
    string,
    string | Array<string | Record<string, unknown>>
  >([
    [
      "react",
      [
        {
          createClass: "createReactClass",
          pragma: "React",
          version: "detect",
          flowVersion: "0.53",
        },
      ],
    ],
    ["propWrapperFunctions", ["forbidExtraProps", { property: "freeze", object: "Object" }]],
    ["linkComponents", ["Hyperlink", { name: "Link", linkAttribute: "to" }]],
  ]);

  const eslintExtends = ["standard", "plugin:react/recommended", "plugin:react-hooks/recommended"];

  api.extendPackage({
    devDependencies: {
      eslint: "^6.8.0",
      "eslint-loader": "^4.0.2",
      "eslint-config-prettier": "^6.11.0",
      "eslint-plugin-react": "^7.19.0",
      "eslint-plugin-react-hooks": "^3.0.0",
      "eslint-config-standard": "^14.1.0",
      "eslint-plugin-standard": "^4.0.1",
      "eslint-plugin-import": "^2.20.0",
      "eslint-plugin-node": "^11.1.0",
      "eslint-plugin-promise": "^4.2.1",
    },
  });

  if (options.language === "js") {
    api.extendPackage({
      scripts: {
        eslint: "eslint --config .eslintrc --ext .jsx,.js src/",
        "eslint:fix": "eslint --fix --config .eslintrc --ext .jsx,.js src/",
        "format:js": "prettier --write 'src/**/*.{js,jsx}'",
        "format:check:js": "prettier --check 'src/**/*.{js,jsx}'",
      },
      devDependencies: {
        "babel-eslint": "^10.1.0",
      },
      dependencies: {
        "prop-types": "^15.7.2",
      },
    });

    eslintSettings.set("import/extensions", [".js", ".jsx"]);

    eslintExtends.push("prettier", "prettier/react");

    eslintRules.set("import/prefer-default-export", ["off"]);
    eslintRules.set("import/no-unresolved", ["off"]);
  }

  if (options.language === "ts") {
    api.extendPackage({
      scripts: {
        eslint: "eslint --config .eslintrc --ext .tsx,.ts src/",
        "eslint:fix": "eslint --fix --config .eslintrc --ext .tsx,.ts src/",
        "format:ts": "prettier --write 'src/**/*.{ts,tsx}'",
        "format:check:ts": "prettier --check 'src/**/*.{ts,tsx}'",
      },
      devDependencies: {
        "@typescript-eslint/parser": "^2.30.0",
        "@typescript-eslint/eslint-plugin": "^2.30.0",
      },
    });

    eslintExtends.push(
      "plugin:@typescript-eslint/recommended-requiring-type-checking",
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:import/typescript",
      "prettier",
      "prettier/react",
      "prettier/@typescript-eslint",
    );

    parserOptions.set("project", ["./tsconfig.json"]);

    eslintSettings.set("import/extensions", [".ts", ".tsx"]);

    eslintRules.set("react/prop-types", "off");
  }

  if (options.unitTest) {
    eslintEnv.set("jest", true);
    eslintRules.set("import/no-extraneous-dependencies", [
      "error",
      { devDependencies: [`**/*.test.${lintFileSuffix}`, `**/*.spec.${lintFileSuffix}`] },
    ]);
  }

  api.render("./template/other", {
    eslintExtends: JSON.stringify(eslintExtends),
    parserOptions: JSON.stringify(parserOptions.toPlainObject()),
    eslintParser: JSON.stringify(eslintParser),
    eslintRules: JSON.stringify(eslintRules.toPlainObject()),
    settings: JSON.stringify(eslintSettings.toPlainObject()),
    eslintEnv: JSON.stringify(eslintEnv.toPlainObject()),
  });
}
