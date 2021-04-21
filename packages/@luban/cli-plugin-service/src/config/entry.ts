import { ConfigPluginInstance, ConfigPluginApplyCallbackArgs } from "../definitions";
import Config = require("webpack-chain");

class Entry implements ConfigPluginInstance {
  public apply(args: ConfigPluginApplyCallbackArgs) {
    const { api } = args;

    api.chainWebpack("server", (webpackConfig: Config) => {
      webpackConfig
        .context(api.getContext())
        .entry("server")
        .add(api.getServerSideClientEntryFile())
        .end();
    });

    api.chainWebpack("client", (webpackConfig) => {
      webpackConfig
        .context(api.getContext())
        .entry("client")
        .add(api.getClientSideEntryFile())
        .end();
    });
  }
}

export default Entry;
