import { ConfigPluginInstance, ConfigPluginApplyCallbackArgs } from "../definitions";
import Config = require("webpack-chain");

class Entry implements ConfigPluginInstance {
  public apply(args: ConfigPluginApplyCallbackArgs) {
    const { api } = args;

    api.chainWebpack("server", (webpackConfig: Config) => {
      webpackConfig
        .context(api.service.context)
        .entry("server")
        .add(api.resolve("src/.luban/server.entry.tsx"))
        .end();
    });

    api.chainWebpack("client", (webpackConfig) => {
      webpackConfig
        .context(api.service.context)
        .entry("client")
        .add(api.resolve("src/.luban/client.entry.tsx"))
        .end();
    });
  }
}

export default Entry;
