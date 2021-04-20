import { ConfigPluginInstance, ConfigPluginApplyCallbackArgs } from "../definitions";

class Devtool implements ConfigPluginInstance {
  apply(args: ConfigPluginApplyCallbackArgs) {
    const { api, projectConfig } = args;

    const isProduction = process.env.NODE_ENV === "production";

    api.chainAllWebpack((webpackConfig) => {
      if (!isProduction) {
        webpackConfig.devtool("cheap-module-eval-source-map");
      } else {
        webpackConfig.devtool(projectConfig.productionSourceMap ? "source-map" : false);
      }
    });
  }
}

export default Devtool;
