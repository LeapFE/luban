import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/lib/generatorAPI";
import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

export default function(api: GeneratorAPI, options: Required<RootOptions>): void {
  if (options.preset.router) {
    api.extendPackage({
      dependencies: {
        "luban-router": "1.0.4",
      },
    });

    if (options.preset.language === "js") {
      api.render("./template/js");
    }

    if (options.preset.language === "ts") {
      api.render("./template/ts");
    }
  }
}
