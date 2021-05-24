import TerserWebpackPlugin from "terser-webpack-plugin";
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import CssNano from "cssnano";

import { terserOptions } from "./../utils/terserOptions";
import { ConfigPluginInstance, ConfigPluginApplyCallbackArgs } from "../definitions";

class Optimization implements ConfigPluginInstance {
  apply(args: ConfigPluginApplyCallbackArgs) {
    const { api, projectConfig } = args;

    const isProduction = process.env.NODE_ENV === "production";

    api.chainWebpack("client", (webpackConfig) => {
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
              styles: {
                name: "styles",
                test: /\.css$/,
                chunks: "all",
                enforce: true,
              },
            },
          })
          .runtimeChunk("single")
          .minimizer("terser")
          .use(TerserWebpackPlugin, [terserOptions(projectConfig.productionSourceMap)])
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

    api.chainWebpack("server", (webpackConfig) => {
      webpackConfig.optimization.splitChunks({}).end();
    });
  }
}

export default Optimization;
