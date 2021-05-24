import { ConfigPluginInstance, ConfigPluginApplyCallbackArgs } from "../definitions";

class Performance implements ConfigPluginInstance {
  apply(args: ConfigPluginApplyCallbackArgs) {
    const { api } = args;

    const isProduction = process.env.NODE_ENV === "production";

    api.chainWebpack("client", (webpackConfig) => {
      webpackConfig.performance
        .hints(isProduction ? "warning" : false)
        // max entry point size 1M
        .maxEntrypointSize(1048576)
        // max asset size 256kb
        .maxAssetSize(262144)
        .end();
    });
  }
}

export default Performance;
