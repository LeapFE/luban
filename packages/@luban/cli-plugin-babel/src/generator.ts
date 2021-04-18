import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/lib/generator/generatorAPI";
// import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

export default function (api: GeneratorAPI): void {
  const babelConfigPreset: Array<string | Array<string | Record<string, unknown>>> = [
    [
      "@babel/preset-env",
      { modules: false, useBuiltIns: "usage", corejs: { version: 3, proposals: true } },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript",
  ];

  const babelConfigPlugins: Array<string | Array<string | Record<string, unknown>>> = [
    "@babel/plugin-transform-runtime",
    "react-refresh/babel",
  ];

  api.extendPackage({
    devDependencies: {
      "@babel/cli": "^7.13.14",
      "@babel/core": "^7.13.15",
      "@babel/plugin-transform-runtime": "^7.13.15",
      "@babel/preset-env": "^7.13.15",
      "@babel/runtime": "^7.13.10",
      "@babel/preset-react": "^7.13.13",
      "core-js": "^3.10.1",
      "babel-loader": "^8.2.2",
      "react-refresh": "^0.9.0",
    },
  });

  api.extendPackage({
    devDependencies: {
      "@babel/preset-typescript": "^7.8.0",
    },
  });

  api.render("./template", {
    presets: JSON.stringify(babelConfigPreset),
    plugins: JSON.stringify(babelConfigPlugins),
  });
}
