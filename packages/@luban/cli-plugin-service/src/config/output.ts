import { ConfigPluginInstance, ConfigPluginApplyCallbackArgs } from "../definitions";

function getScriptsDir(dir: string = ""): string {
  const adaptedDir = dir.replace(/^\/|\/$|\s+/g, "");
  if (adaptedDir === "") {
    return "";
  }

  return `${adaptedDir}/`;
}

class Output implements ConfigPluginInstance {
  apply(args: ConfigPluginApplyCallbackArgs) {
    const { api, commandName, projectConfig } = args;

    const outputDir = api.resolve(projectConfig.outputDir);

    const scriptsDir = getScriptsDir(projectConfig.assetsDir.scripts);

    const baseFilename = "[name]-[hash:8].js";
    const filename = commandName === "build" ? `${scriptsDir}${baseFilename}` : baseFilename;
    const baseChunkFilename = "[name]-[hash:8].chunk.js";
    const chunkFilename =
      commandName === "build" ? `${scriptsDir}${baseChunkFilename}` : baseChunkFilename;

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
