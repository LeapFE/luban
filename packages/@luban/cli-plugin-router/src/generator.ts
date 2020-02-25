import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/src/lib/generatorAPI";
import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

export default function(api: GeneratorAPI, options: Required<RootOptions>): void {
  if (options.preset.router) {
    api.extendPackage({
      dependencies: {
        "luban-router": "0.0.6",
      },
    });

    if (options.preset.language === "js") {
      api.render("./template");
    }

    if (options.preset.language === "ts") {
      api.render("./template/ts");
    }
  }
}
