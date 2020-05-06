import TerserWebpackPlugin from "terser-webpack-plugin";
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import CssNano from "cssnano";
import path from "path";

import { PluginAPI } from "./../lib/PluginAPI";
import { ProjectConfig } from "./../definitions";

import { terserOptions } from "./../utils/terserOptions";
import { MovePlugin } from "./../utils/movePlugin";

function getScriptsDir(dir: string): string {
  const adaptedDir = dir.replace(/^\/|\/$|\s+/g, "");
  if (adaptedDir === "") {
    return "";
  }

  return `${adaptedDir}/`;
}

export default function(api: PluginAPI, options: Required<ProjectConfig>): void {
  api.chainWebpack((webpackConfig) => {
    const isProduction = process.env.NODE_ENV === "production";

    const outputDir = api.resolve(options.outputDir);

    const scriptsDir = getScriptsDir(options.assetsDir.scripts);

    const filename = `${scriptsDir}[name]-[hash:8].js`;
    const chunkFilename = `${scriptsDir}[name]-[chunkhash:8].js`;

    webpackConfig.output
      .path(outputDir)
      .filename(filename)
      .chunkFilename(chunkFilename)
      .end();

    if (options.productionSourceMap) {
      webpackConfig.output.sourceMapFilename("[name].[hash:8]-map.js").end();
    }

    // handle options.indexPath
    if (isProduction) {
      if (options.indexPath !== "index.html") {
        webpackConfig
          .plugin("move")
          .use(MovePlugin, [
            path.resolve(`${outputDir}/index.html`),
            path.resolve(`${outputDir}/${options.indexPath}`),
          ]);
      }
    }

    if (isProduction) {
      webpackConfig.mode("production").devtool(options.productionSourceMap ? "source-map" : false);

      webpackConfig
        .plugin("hash-module-ids")
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        .use(require("webpack/lib/HashedModuleIdsPlugin"), [{ hashDigest: "hex" }]);
    }

    if (isProduction) {
      webpackConfig.optimization
        .splitChunks({
          cacheGroups: {
            common: {
              chunks: "initial",
              name: "common",
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
            },
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              chunks: "initial",
              name: "vendors",
              priority: 10,
              enforce: true,
            },
            style: {
              test: /\.css$/,
              name: "style",
              chunks: "all",
            },
          },
        })
        .runtimeChunk({
          name: "manifest",
        })
        .minimizer("terser")
        .use(TerserWebpackPlugin, [terserOptions(options)])
        .end()
        .minimizer("optimizeCss")
        .use(OptimizeCssAssetsPlugin, [
          {
            cssProcessor: CssNano,
            cssProcessorPluginOptions: {
              preset: [
                "default",
                {
                  discardComments: { removeAll: false },
                  discardEmpty: { removeAll: true },
                  discardUnused: { removeAll: true },
                },
              ],
            },
          },
        ])
        .end();
    }
  });
}
