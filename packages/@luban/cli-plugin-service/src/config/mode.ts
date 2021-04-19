import { ConfigPluginInstance, ConfigPluginApplyCallbackArgs } from "../definitions";
import Config = require("webpack-chain");
import { Configuration } from "webpack";

class Mode implements ConfigPluginInstance {
  public apply(args: ConfigPluginApplyCallbackArgs) {
    const { api } = args;

    const mode = (process.env.NODE_ENV as Configuration["mode"]) || "development";

    api.chainAllWebpack((webpackConfig: Config) => {
      webpackConfig.mode(mode).end();
    });
  }
}

export default Mode;
