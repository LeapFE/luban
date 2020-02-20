import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/src/lib/generatorAPI";
import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

export default function(api: GeneratorAPI, options: Required<RootOptions>): void {
  api.extendPackage({
    scripts: {
      start: "npm run serve",
      serve: "luban-cli-service serve --open",
      build: "luban-cli-service build",
      inspect: "luban-cli-service inspect",
    },
  });

  const modifyFile = options.preset.language === "ts" ? "src/App.tsx" : "src/App.jsx";

  api.render("./template/service");

  api.extendPackage({
    dependencies: {
      react: "^16.12.0",
      "react-dom": "^16.12.0",
      "react-hot-loader": "^4.12.16",
    },
    devDependencies: {
      prettier: "^1.19.1",
      autoprefixer: "^9.7.1",
      cssnano: "^4.1.10",
      "postcss-preset-env": "^6.7.0",
    },
    browserslist: [
      "last 1 version",
      "> 1%",
      "maintained node versions",
      "not ie <= 10",
      "not dead",
    ],
  });

  if (options.preset.cssPreprocessor) {
    if (options.preset.cssPreprocessor === "less") {
      api.extendPackage({
        devDependencies: {
          less: "^3.10.0",
          "less-loader": "^5.0.0",
        },
      });
    }

    if (options.preset.cssPreprocessor === "styled-components") {
      api.extendPackage({
        dependencies: {
          "styled-components": "^4.4.0",
        },
      });
    }

    if (options.preset.cssPreprocessor === "less" && options.preset.language === "js") {
      api.render("./template/JSLess", { modifyFile });
    }

    if (options.preset.cssPreprocessor === "less" && options.preset.language === "ts") {
      api.render("./template/TSLess", { modifyFile });
    }

    if (
      options.preset.cssPreprocessor === "styled-components" &&
      options.preset.language === "js"
    ) {
      api.render("./template/JSstyledComponents", { modifyFile });
    }

    if (
      options.preset.cssPreprocessor === "styled-components" &&
      options.preset.language === "ts"
    ) {
      api.render("./template/TSstyledComponents", { modifyFile });
    }
  }
}
