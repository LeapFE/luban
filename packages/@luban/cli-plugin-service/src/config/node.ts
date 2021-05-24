import { ConfigPluginInstance, ConfigPluginApplyCallbackArgs } from "../definitions";

class Node implements ConfigPluginInstance {
  apply(args: ConfigPluginApplyCallbackArgs) {
    const { api } = args;

    api.chainWebpack("server", (webpackConfig) => {
      webpackConfig.node
        .set("__dirname", true)
        .set("__filename", true)
        .end();
    });
  }
}

export default Node;
