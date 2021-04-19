import { ConfigPluginInstance, ConfigPluginApplyCallbackArgs } from "../definitions";

class Module implements ConfigPluginInstance {
  apply(args: ConfigPluginApplyCallbackArgs) {
    const { api } = args;

    console.log(api);
  }
}

export default Module;
