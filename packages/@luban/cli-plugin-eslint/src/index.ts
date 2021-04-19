import {
  ConfigPluginApplyCallbackArgs,
  ConfigPluginInstance,
} from "@luban-cli/cli-shared-types/dist/cli-service/definitions";

export default class Eslint implements ConfigPluginInstance {
  apply(args: ConfigPluginApplyCallbackArgs) {
    const { api } = args;

    api.chainWebpack("client", (config) => {
      config.module
        .rule("eslint")
        .test(/\.ts[x]?$/)
        .enforce("pre")
        .exclude.add(/node_modules/)
        .end()
        .use("eslint-loader")
        .loader("eslint-loader")
        .end();
    });
  }
}
