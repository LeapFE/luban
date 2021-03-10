import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/lib/generator/generatorAPI";
import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

import { SimpleMapPolyfill } from "@luban-cli/cli-shared-utils";

export default function(api: GeneratorAPI, options: Required<RootOptions>): void {
  const sourceDir = options.isLib ? "components" : "src";

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
  let lintScript = `stylelint ${sourceDir}/**/*.css`;

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
        "format:style": `prettier --write '${sourceDir}/**/*.{css,css.ts}'`,
        "format:check:style": `prettier --check '${sourceDir}/**/*.{css,css.ts}'`,
      },
    });

    lintScript = `stylelint ${sourceDir}/**/*.{css,css.ts}`;
  }

  if (options.cssSolution === "less") {
    lintScript = `stylelint ${sourceDir}/**/*.{css,less}`;
    stylelintRules.set("selector-pseudo-class-no-unknown", [
      true,
      {
        ignorePseudoClasses: ["export", "import", "global", "local", "external"],
      },
    ]);

    api.extendPackage({
      scripts: {
        "format:style": `prettier --write '${sourceDir}/**/*.{css,less}'`,
        "format:check:style": `prettier --check '${sourceDir}/**/*.{css,less}'`,
      },
    });
  }

  let lintStyleFileSuffix = `${sourceDir}/**/*.{css,less}`;

  if (options.cssSolution === "styled-components") {
    lintStyleFileSuffix = `${sourceDir}/**/*.{css,css.ts}`;
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
