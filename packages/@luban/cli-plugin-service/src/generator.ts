import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/lib/generator/generatorAPI";
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

  const modifyFile =
    options.language === "ts"
      ? "src/components/Welcome/index.tsx"
      : "src/components/Welcome/index.jsx";

  api.render("./template/service");

  api.extendPackage({
    dependencies: {
      react: "^16.13.1",
      "react-dom": "^16.13.1",
      "react-hot-loader": "^4.12.19",
    },
    devDependencies: {
      prettier: "^1.19.1",
      autoprefixer: "^9.7.1",
      cssnano: "^4.1.10",
      "postcss-preset-env": "^6.7.0",
      "css-loader": "^3.4.0",
      "file-loader": "^5.1.0",
      "postcss-loader": "^3.0.0",
      "url-loader": "^3.0.0",
      "style-loader": "^1.1.3",
    },
  });

  if (options.cssSolution) {
    if (options.cssSolution === "less") {
      api.extendPackage({
        devDependencies: {
          less: "^3.10.0",
          "less-loader": "^5.0.0",
        },
      });
    }

    if (options.cssSolution === "styled-components") {
      api.extendPackage({
        dependencies: {
          "styled-components": "^4.4.0",
        },
      });
    }

    if (options.cssSolution === "less" && options.language === "js") {
      api.render("./template/JSLess", {
        modifyFile,
        useStore: options.store,
        useFetch: options.fetch,
      });
    }

    if (options.cssSolution === "less" && options.language === "ts") {
      api.render("./template/TSLess", {
        modifyFile,
        useStore: options.store,
        useFetch: options.fetch,
      });
    }

    if (options.cssSolution === "styled-components" && options.language === "js") {
      api.render("./template/JSstyledComponents", {
        modifyFile,
        useStore: options.store,
        useFetch: options.fetch,
      });
    }

    if (options.cssSolution === "styled-components" && options.language === "ts") {
      api.render("./template/TSstyledComponents", {
        modifyFile,
        useStore: options.store,
        useFetch: options.fetch,
      });
    }
  }
}
