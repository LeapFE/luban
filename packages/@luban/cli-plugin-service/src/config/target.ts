import { ConfigPluginInstance, ConfigPluginApplyCallbackArgs } from "../definitions";

class Target implements ConfigPluginInstance {
  apply(args: ConfigPluginApplyCallbackArgs) {
    const { api } = args;

    api.chainWebpack("client", (webpackConfig) => {
      webpackConfig.target("web");
    });

    api.chainWebpack("server", (webpackConfig) => {
      webpackConfig.target("node");
    });
  }
}

export default Target;
