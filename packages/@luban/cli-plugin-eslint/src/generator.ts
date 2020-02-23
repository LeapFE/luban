import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/src/lib/generatorAPI";
import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

import { SimpleMapPolyfill } from "@luban-cli/cli-shared-utils";

export default function(api: GeneratorAPI, options: Required<RootOptions>): void {
  const eslintParser =
    options.preset.language === "ts" ? "@typescript-eslint/parser" : "babel-eslint";

  const parserOptions = new SimpleMapPolyfill<
    string,
    string | number | Record<string, any> | Array<string | Record<string, any>>
  >([
    ["ecmaVersion", 11],
    ["sourceType", "module"],
    [
      "ecmaFeatures",
      {
        jsx: true,
      },
    ],
  ]);

  const eslintRules = new SimpleMapPolyfill<string, string | Array<string | Record<string, any>>>([
    ["quotes", ["error", "double"]],
    ["semi", ["error", "always"]],
    ["react/display-name", ["warn"]],
    ["react/prop-types", ["error"]],
    ["space-before-function-paren", ["error", "never"]],
    ["comma-dangle", ["error", "always-multiline"]],
  ]);
  const eslintPlugins = ["react-hooks"];

  const eslintSettings = new SimpleMapPolyfill<
    string,
    string | Array<string | Record<string, any>>
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

  const eslintExtends = [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier",
    "prettier/react",
  ];

  if (options.preset.language === "js") {
    api.extendPackage({
      scripts: {
        eslint: "eslint --config .eslintrc --ext .jsx,.js src/",
        "format:js": "prettier --write src/**/*.{js,jsx}",
        "format:check:js": "prettier --check src/**/*.{js,jsx}",
      },
      devDependencies: {
        "babel-eslint": "^10.0.3",
      },
      dependencies: {
        "prop-types": "^15.7.2",
      },
    });
  }

  if (options.preset.language === "ts") {
    api.extendPackage({
      scripts: {
        eslint: "eslint --config .eslintrc --ext .tsx,.ts src/",
        check: "tsc --noEmit",
        "format:ts": "prettier --write src/**/*.{ts,tsx}",
        "format:check:ts": "prettier --check src/**/*.{ts,tsx}",
      },
      devDependencies: {
        "@typescript-eslint/parser": "^2.20.0",
        "@typescript-eslint/eslint-plugin": "^2.7.0",
      },
    });

    eslintPlugins.push("@typescript-eslint");
    eslintExtends.push(
      "prettier/@typescript-eslint",
      "plugin:@typescript-eslint/recommended-requiring-type-checking",
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:import/typescript",
    );

    parserOptions.set("project", "./tsconfig.json");

    eslintSettings.set("import/extensions", [".ts", ".tsx"]);

    eslintRules.set("react/prop-types", ["off"]);
    eslintRules.set("import/prefer-default-export", ["off"]);
  }

  if (options.preset.eslint === "standard") {
    api.extendPackage({
      devDependencies: {
        "eslint-config-standard": "^14.1.0",
        "eslint-plugin-node": "^10.0.0",
        "eslint-plugin-promise": "^4.2.1",
        "eslint-plugin-standard": "^4.0.1",
      },
    });

    eslintExtends.push("standard");
  }

  if (options.preset.eslint === "airbnb") {
    api.extendPackage({
      devDependencies: {
        "eslint-config-airbnb": "^18.0.1",
        "eslint-plugin-jsx-a11y": "^6.2.3",
      },
    });

    eslintExtends.push("airbnb");

    if (options.preset.language === "ts") {
      eslintRules.set("react/state-in-constructor", ["warn"]);
      eslintRules.set("import/no-unresolved", ["off"]);
      eslintRules.set("react/jsx-filename-extension", ["error", { extensions: [".ts", ".tsx"] }]);
      eslintRules.set("import/extensions", ["off"]);
    }
  }

  api.extendPackage({
    devDependencies: {
      eslint: "^6.6.0",
      "eslint-config-prettier": "^6.10.0",
      "eslint-plugin-react": "^7.16.0",
      "eslint-plugin-react-hooks": "^2.4.0",
      "eslint-plugin-import": "^2.18.2",
      "eslint-loader": "^3.0.3",
    },
  });

  const lintFileSuffix =
    options.preset.language === "ts" ? "src/**/*.{ts,tsx}" : "src/**/*.{js,jsx}";

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
        [lintFileSuffix]: ["npm run eslint", `npm run format:check:${options.preset.language}`],
      },
    });
  }

  api.render("./template", {
    eslintExtends: JSON.stringify(eslintExtends),
    eslintPlugins: JSON.stringify(eslintPlugins),
    parserOptions: JSON.stringify(parserOptions.toPlainObject()),
    eslintParser: JSON.stringify(eslintParser),
    eslintRules: JSON.stringify(eslintRules.toPlainObject()),
    settings: JSON.stringify(eslintSettings.toPlainObject()),
  });
}
