import { ConfigPluginInstance, ConfigPluginApplyCallbackArgs } from "../definitions";

class Resolve implements ConfigPluginInstance {
  apply(args: ConfigPluginApplyCallbackArgs) {
    const { api, projectConfig } = args;

    api.chainAllWebpack((webpackConfig) => {
      webpackConfig.resolve.extensions
        .merge([".js", ".jsx", ".ts", ".json", ".tsx"])
        .end()
        .modules.add("node_modules")
        .add(api.resolve("node_modules"))
        .end()
        .alias.set("@", api.resolve("src"))
        .end();

      const aliasKeys = Object.keys(projectConfig.alias);
      if (aliasKeys.length > 0) {
        aliasKeys.forEach((key) => {
          webpackConfig.resolve.alias.set(key, projectConfig.alias[key]);
        });
      }
    });
  }
}

export default Resolve;
