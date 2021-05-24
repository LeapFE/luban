import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/lib/generator/generatorAPI";

export default function(api: GeneratorAPI): void {
  api.extendPackage({
    scripts: {
      start: "npm run serve",
      serve: "luban-cli-service serve --open",
      build: "luban-cli-service build",
      inspect: "luban-cli-service inspect",
      postinstall: "luban-cli-service produce",
      compile: "tsc --noEmit --diagnostics",
    },
  });

  const modifyFile = "src/components/Welcome/index.tsx";

  api.extendPackage({
    dependencies: {
      react: "^16.14.0",
      "react-dom": "^16.14.0",
      "react-router-dom": "^5.2.0",
      "lodash.clonedeepwith": "^4.5.0",
      "path-to-regexp": "^6.2.0",
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
      typescript: "3.9.9",
      "@types/lodash.clonedeepwith": "^4.5.6",
      "@types/react": "^16.14.5",
      "@types/react-dom": "^16.9.12",
      "@types/react-router-dom": "^5.1.7",
      "@types/react-loadable": "^5.5.5",
    },
  });

  api.extendPackage({
    devDependencies: {
      less: "^3.10.0",
      "less-loader": "^5.0.0",
    },
  });

  const additionalData = {
    modifyFile,
  };

  api.render("./template/service", additionalData);
}
