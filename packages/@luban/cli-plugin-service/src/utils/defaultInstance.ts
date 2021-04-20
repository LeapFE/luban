import { ConfigPluginInstance, ConfigPluginApplyCallbackArgs } from "../definitions";

class DefaultInstance implements ConfigPluginInstance {
  apply(_args: ConfigPluginApplyCallbackArgs) {
    // do nothing
  }
}

export { DefaultInstance };
