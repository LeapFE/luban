import { ConfigPluginInstance, ConfigPluginApplyCallbackArgs } from "../definitions";
import { cleanAssetPath } from "../utils/cleanAssetPath";

class Output implements ConfigPluginInstance {
  apply(args: ConfigPluginApplyCallbackArgs) {
    const { api, commandName, projectConfig } = args;

    const outputDir = api.resolve(projectConfig.outputDir);

    const scriptsDir = projectConfig.assetsDir.scripts;

    const baseFilename = "[name]-[hash:8].js";
    const filename =
      commandName === "build" ? cleanAssetPath(`${scriptsDir}/${baseFilename}`) : baseFilename;

    const baseChunkFilename = "[name]-[hash:8].chunk.js";
    const chunkFilename =
      commandName === "build"
        ? cleanAssetPath(`${scriptsDir}/${baseChunkFilename}`)
        : baseChunkFilename;

    api.chainWebpack("server", (webpackConfig) => {
      webpackConfig.output
        .path(outputDir)
        .filename("server-bundle.js")
        .libraryTarget("commonjs2")
        .library("server-output")
        .publicPath(projectConfig.publicPath)
        .end();
    });

    api.chainWebpack("client", (webpackConfig) => {
      webpackConfig.output
        .path(outputDir)
        .filename(filename)
        .publicPath(projectConfig.publicPath)
        .chunkFilename(chunkFilename)
        .end();

      if (projectConfig.productionSourceMap) {
        webpackConfig.output.sourceMapFilename(`${scriptsDir}[name].[hash:8].map.json`).end();
      }
    });
  }
}

export default Output;
