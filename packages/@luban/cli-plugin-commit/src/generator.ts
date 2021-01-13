import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/lib/generator/generatorAPI";
// import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

export default function(api: GeneratorAPI): void {
  api.extendPackage({
    devDependencies: {
      "@commitlint/cli": "^8.3.5",
      "@commitlint/config-conventional": "^8.3.4",
      commitizen: "^4.1.2",
      "cz-conventional-changelog": "^3.2.0",
    },
    husky: {
      hooks: {
        "pre-commit": "lint-staged",
        "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
        "prepare-commit-msg": "exec < /dev/tty && git cz --hook || true",
      },
    },
    config: {
      commitizen: {
        path: "cz-conventional-changelog",
      },
    },
  });

  api.render("./template");
}
