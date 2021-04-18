import { PluginAPI } from "@luban-cli/cli-shared-types/dist/cli-service/lib/PluginAPI";

export default function (api: PluginAPI): void {
  api.chainWebpack((config) => {
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
