import nodeExternals from "webpack-node-externals";

import { ConfigPluginInstance, ConfigPluginApplyCallbackArgs } from "../definitions";

class Externals implements ConfigPluginInstance {
  apply(args: ConfigPluginApplyCallbackArgs) {
    const { api } = args;

    api.chainWebpack("server", (webpackConfig) => {
      webpackConfig.externals([nodeExternals({ allowlist: /\.(css|less)$/ })]);
    });
  }
}

export default Externals;
