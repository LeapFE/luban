import { ConfigPluginInstance, ConfigPluginApplyCallbackArgs } from "../definitions";
import Config = require("webpack-chain");

class Entry implements ConfigPluginInstance {
  public apply(args: ConfigPluginApplyCallbackArgs) {
    const { api, projectConfig } = args;

    const entryName = projectConfig.ssr ? "server" : "client";
    const entry = projectConfig.ssr
      ? api.resolve("src/.luban/server.entry.tsx")
      : api.resolve("src/.luban/client.entry.tsx");

    api.chainWebpack((webpackConfig: Config) => {
      webpackConfig.context(api.service.context).entry(entryName).add(entry).end();
    });
  }
}

export default Entry;
