import { ConfigPluginInstance, ConfigPluginApplyCallbackArgs } from "../definitions";
import Config = require("webpack-chain");

class Mode implements ConfigPluginInstance {
  public apply(args: ConfigPluginApplyCallbackArgs) {
    const { api } = args;

    api.chainWebpack((webpackConfig: Config) => {
      webpackConfig.mode("development").end();
    });
  }
}

export default Mode;
