import {
  ConfigPluginApplyCallbackArgs,
  ConfigPluginInstance,
} from "@luban-cli/cli-shared-types/dist/cli-service/definitions";
import EslintWebpackPlugin from "eslint-webpack-plugin";

export default class Eslint implements ConfigPluginInstance {
  apply(args: ConfigPluginApplyCallbackArgs) {
    const { api } = args;

    api.chainAllWebpack((config) => {
      config
        .plugin("eslint")
        .use(EslintWebpackPlugin, [
          {
            context: api.getContext(),
            extensions: ["ts", "tsx"],
            exclude: "node_modules",
          },
        ])
        .end();
    });
  }
}
