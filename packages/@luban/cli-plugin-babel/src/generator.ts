import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/src/lib/generatorAPI";
import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

export default function(api: GeneratorAPI, rootOptions: Required<RootOptions>): void {
  const babelConfigPreset: Array<string | Array<string | Record<string, any>>> = [
    ["@babel/preset-env", { useBuiltIns: "usage", corejs: { version: 3, proposals: true } }],
    "@babel/preset-react",
  ];

  const babelConfigPlugins: Array<string | Array<string | Record<string, any>>> = [
    "react-hot-loader/babel",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
  ];

  let babelConfigEnv = {};

  if (api.useTsWithBabel()) {
    babelConfigPreset.push("@babel/preset-typescript");

    api.extendPackage({
      devDependencies: {
        "@babel/preset-typescript": "^7.7.2",
      },
    });
  }

  if (rootOptions.preset.cssPreprocessor === "styled-components") {
    babelConfigPlugins.push([
      "babel-plugin-styled-components",
      {
        displayName: true,
        fileName: false,
        minify: true,
        pure: true,
      },
    ]);
  }

  if (rootOptions.preset.plugins["@luban-cli/cli-plugin-eslint"]) {
    api.extendPackage({
      devDependencies: {
        "babel-plugin-transform-react-remove-prop-types": "^0.4.24",
      },
    });

    babelConfigEnv = {
      production: {
        plugins: ["transform-react-remove-prop-types"],
      },
    };
  }

  api.extendPackage({
    devDependencies: {
      "@babel/cli": "^7.7.0",
      "@babel/core": "^7.7.2",
      "@babel/plugin-proposal-class-properties": "^7.7.0",
      "@babel/plugin-proposal-object-rest-spread": "^7.6.2",
      "@babel/plugin-transform-runtime": "^7.6.2",
      "@babel/preset-env": "^7.7.1",
      "@babel/runtime": "^7.7.2",
      "@babel/preset-react": "^7.7.0",
      "core-js": "^3.4.2",
    },
  });

  api.render("./../../../template/babel", {
    presets: JSON.stringify(babelConfigPreset),
    plugins: JSON.stringify(babelConfigPlugins),
    env: JSON.stringify(babelConfigEnv),
  });
}
