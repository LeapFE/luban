import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/lib/generator/generatorAPI";
import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

import { SimpleMapPolyfill } from "@luban-cli/cli-shared-utils";

export default function(api: GeneratorAPI, options: Required<RootOptions>): void {
  const processors: (string | (string | Record<string, unknown>)[])[] = [];
  const extendsConfig: (string | (string | Record<string, unknown>)[])[] = [
    "stylelint-config-standard",
    "stylelint-config-prettier",
  ];
  const stylelintRules = new SimpleMapPolyfill<
    string,
    string | Array<string | Record<string, unknown> | boolean>
  >([
    ["comment-empty-line-before", ["always"]],

    [
      "rule-empty-line-before",
      [
        "always",
        {
          ignore: ["after-comment", "first-nested"],
        },
      ],
    ],
  ]);
  let lintScript = "stylelint src/**/*.css";

  if (options.cssSolution === "styled-components") {
    processors.push([
      "stylelint-processor-styled-components",
      {
        moduleName: "styled-components",
        strict: false,
        ignoreFiles: ["**/*.css"],
      },
    ]);

    extendsConfig.push("stylelint-config-styled-components");

    api.extendPackage({
      devDependencies: {
        "stylelint-config-styled-components": "^0.1.1",
        "stylelint-processor-styled-components": "^1.10.0",
      },
      scripts: {
        "format:style": `prettier --write 'src/**/*.{css,css.${options.language}}'`,
        "format:check:style": `prettier --check 'src/**/*.{css,css.${options.language}}'`,
      },
    });

    lintScript = `stylelint src/**/*.{css,css.${options.language}}`;
  }

  if (options.cssSolution === "less") {
    lintScript = "stylelint src/**/*.{css,less}";
    stylelintRules.set("selector-pseudo-class-no-unknown", [
      true,
      {
        ignorePseudoClasses: ["export", "import", "global", "local", "external"],
      },
    ]);

    api.extendPackage({
      scripts: {
        "format:style": "prettier --write 'src/**/*.{css,less}'",
        "format:check:style": "prettier --check 'src/**/*.{css,less}'",
      },
    });
  }

  let lintStyleFileSuffix = "src/**/*.{css,less}";

  if (options.cssSolution === "styled-components") {
    if (options.language === "js") {
      lintStyleFileSuffix = "src/**/*.{css,css.js}";
    }

    if (options.language === "ts") {
      lintStyleFileSuffix = "src/**/*.{css,css.ts}";
    }
  }

  api.extendPackage({
    devDependencies: {
      stylelint: "^13.5.0",
      "stylelint-config-standard": "^20.0.0",
      "stylelint-config-prettier": "^8.0.1",
    },
    scripts: {
      stylelint: lintScript,
    },
  });

  if (api.isGitRepository()) {
    api.extendPackage({
      "lint-staged": {
        [lintStyleFileSuffix]: ["npm run stylelint", "npm run format:check:style"],
      },
    });
  }

  api.render("./template", {
    processors: JSON.stringify(processors),
    extendsConfig: JSON.stringify(extendsConfig),
    rules: JSON.stringify(stylelintRules.toPlainObject()),
  });
}
