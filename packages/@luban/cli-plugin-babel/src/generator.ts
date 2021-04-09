import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/lib/generator/generatorAPI";
// import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

export default function(api: GeneratorAPI): void {
  const babelConfigPreset: Array<string | Array<string | Record<string, unknown>>> = [
    [
      "@babel/preset-env",
      { modules: false, useBuiltIns: "usage", corejs: { version: 3, proposals: true } },
    ],
    "@babel/preset-react",
  ];

  const babelConfigPlugins: Array<string | Array<string | Record<string, unknown>>> = [
    "react-hot-loader/babel",
    "@babel/plugin-transform-runtime",
  ];

  api.extendPackage({
    devDependencies: {
      "@babel/cli": "^7.7.0",
      "@babel/core": "^7.7.2",
      "@babel/plugin-transform-runtime": "^7.6.2",
      "@babel/preset-env": "^7.7.1",
      "@babel/runtime": "^7.7.2",
      "@babel/preset-react": "^7.7.0",
      "core-js": "^3.4.2",
      "babel-loader": "^8.0.6",
    },
  });

  babelConfigPreset.push("@babel/preset-typescript");

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
