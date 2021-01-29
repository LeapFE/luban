import crypto from "crypto";
import { createTransformer } from "babel-jest";
import { Transformer } from "@jest/transform";

import { getBabelConfig } from "./lib/getBabelConfig";

import { getProjectPackageJson } from "./lib/share";

const pkg = getProjectPackageJson();

export const processor: Transformer = {
  canInstrument: true,
  process(src, path, config, transformOptions) {
    const babelConfig = getBabelConfig(true, true);

    babelConfig.plugins = babelConfig.plugins || [];

    babelConfig.plugins.push([
      require.resolve("babel-plugin-import"),
      {
        libraryName: pkg.name,
        libraryDirectory: "../src",
      },
    ]);

    const babelSupport =
      path.endsWith(".ts") ||
      path.endsWith(".tsx") ||
      path.endsWith(".js") ||
      path.endsWith(".jsx");

    const babelJest = createTransformer(babelConfig);
    const fileName = babelSupport ? path : "file.js";
    return babelJest.process(src, fileName, config, transformOptions);
  },

  getCacheKey() {
    return crypto
      .createHash("md5")
      .update("\0", "utf8")
      .update("components")
      .update("\0", "utf8")
      .update(pkg.version)
      .digest("hex");
  },
};
