import StylelintPlugin from "stylelint-webpack-plugin";
import { join } from "path";

import { PluginAPI } from "@luban-cli/cli-shared-types/dist/cli-service/lib/PluginAPI";

export default function (api: PluginAPI): void {
  api.chainWebpack((webpackConfig) => {
    webpackConfig.plugin("style-lint-plugin").use(StylelintPlugin, [
      {
        files: ["**/*.css", "**/*.css.js", "**/*.less", "**/*.css.ts"],
        emitErrors: true,
        context: api.resolve("src"),
        configFile: join(api.service.context, ".stylelintrc"),
      },
    ]);
  });
}
