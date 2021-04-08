import { TransformOptions } from "@babel/core";

export function getBabelConfig(
  isCommonjsModuleStyle: boolean,
  supportTs = false,
): TransformOptions {
  const plugins = [
    [
      require.resolve("@babel/plugin-transform-typescript"),
      {
        isTSX: true,
      },
    ],
    require.resolve("babel-plugin-inline-import-data-uri"),
    require.resolve("@babel/plugin-transform-member-expression-literals"),
    require.resolve("@babel/plugin-transform-object-assign"),
    require.resolve("@babel/plugin-transform-property-literals"),
    [
      require.resolve("@babel/plugin-transform-runtime"),
      {
        useESModules: isCommonjsModuleStyle === false,
        version: "^7.10.4",
      },
    ],
    require.resolve("@babel/plugin-transform-spread"),
    require.resolve("@babel/plugin-transform-template-literals"),
    require.resolve("@babel/plugin-proposal-export-default-from"),
    require.resolve("@babel/plugin-proposal-export-namespace-from"),
    require.resolve("@babel/plugin-proposal-object-rest-spread"),
    [
      require.resolve("@babel/plugin-proposal-decorators"),
      {
        legacy: true,
      },
    ],
    require.resolve("@babel/plugin-proposal-class-properties"),
  ];

  const presets = [
    require.resolve("@babel/preset-react"),
    [
      require.resolve("@babel/preset-env"),
      {
        modules: isCommonjsModuleStyle ? "commonjs" : "auto",
        targets: {
          browsers: ["last 2 versions", "Firefox ESR", "> 1%", "ie >= 11"],
        },
      },
    ],
  ];

  if (supportTs) {
    presets.push(require.resolve("@babel/preset-typescript"));
  }

  return {
    presets,
    plugins,
  };
}
