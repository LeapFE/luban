import StylelintPlugin from "stylelint-webpack-plugin";
import { join } from "path";

import {
  ConfigPluginInstance,
  ConfigPluginApplyCallbackArgs,
} from "@luban-cli/cli-shared-types/dist/cli-service/definitions";

export default class Stylelint implements ConfigPluginInstance {
  apply(args: ConfigPluginApplyCallbackArgs) {
    const { api } = args;

    api.chainWebpack((webpackConfig) => {
      webpackConfig.plugin("style-lint-plugin").use(StylelintPlugin, [
        {
          files: ["**/*.css", "**/*.less"],
          emitErrors: true,
          context: api.resolve("src"),
          configFile: join(api.service.context, ".stylelintrc"),
        },
      ]);
    });
  }
}
