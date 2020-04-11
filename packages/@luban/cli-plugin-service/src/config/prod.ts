import { PluginAPI } from "./../lib/PluginAPI";
import { ProjectConfig } from "./../definitions";
import { getAssetsPath } from "./../utils/getAssetsPath";

export default function(api: PluginAPI, options: Required<ProjectConfig>): void {
  api.chainWebpack((webpackConfig) => {
    const isProduction = process.env.NODE_ENV === "production";

    const outputDir = api.resolve(options.outputDir);

    const filename = getAssetsPath(options, "scripts/[name]-[hash:8].js");
    const chunkFilename = getAssetsPath(options, "scripts/[name]-[chunkhash:8].js");

    webpackConfig.output
      .path(outputDir)
      .filename(filename)
      .chunkFilename(chunkFilename)
      .end();

    if (options.productionSourceMap) {
      webpackConfig.output.sourceMapFilename("[name].[hash:8]-map.js").end();
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
        });
    }
  });
}
