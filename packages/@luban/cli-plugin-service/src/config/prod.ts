import TerserWebpackPlugin from "terser-webpack-plugin";
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import CssNano from "cssnano";
import path from "path";
import PreloadWebpackPlugin = require("preload-webpack-plugin");
import HashedModuleIdsPlugin from "webpack/lib/HashedModuleIdsPlugin";

import { PluginAPI } from "./../lib/PluginAPI";
import { ProjectConfig } from "./../main";

import { terserOptions } from "./../utils/terserOptions";
import { MovePlugin } from "./../utils/movePlugin";

function getScriptsDir(dir: string = ""): string {
  const adaptedDir = dir.replace(/^\/|\/$|\s+/g, "");
  if (adaptedDir === "") {
    return "";
  }

  return `${adaptedDir}/`;
}

export default function(api: PluginAPI, options: ProjectConfig): void {
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
      webpackConfig.output.sourceMapFilename(`${scriptsDir}[name].[hash:8]-map.js`).end();
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

      webpackConfig.plugin("hash-module-ids").use(HashedModuleIdsPlugin, [{ hashDigest: "hex" }]);
    }

    if (isProduction) {
      webpackConfig.optimization
        .splitChunks({
          cacheGroups: {
            common: {
              chunks: "initial",
              name: "common",
              priority: -20,
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
            },
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              chunks: "initial",
              name: "vendors",
              priority: -10,
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
        .use(TerserWebpackPlugin, [terserOptions(options.productionSourceMap)])
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

    if (isProduction) {
      webpackConfig.plugin("preload").use(PreloadWebpackPlugin, [
        {
          rel: "preload",
          include: "initial",
          fileBlacklist: [/map.js$/],
        },
      ]);

      webpackConfig.plugin("prefetch").use(PreloadWebpackPlugin, [
        {
          rel: "prefetch",
          include: "asyncChunks",
        },
      ]);
    }
  });
}
