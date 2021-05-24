import { ConfigPluginInstance, ConfigPluginApplyCallbackArgs } from "../definitions";

class Watch implements ConfigPluginInstance {
  apply(args: ConfigPluginApplyCallbackArgs) {
    const { api } = args;

    api.chainAllWebpack((webpackConfig) => {
      webpackConfig.watchOptions({
        ignored: [`${api.getContext()}/src/index.tsx`, `${api.getContext()}/src/route.ts`],
      });
    });
  }
}

export default Watch;
