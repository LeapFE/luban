import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/lib/generator/generatorAPI";
import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

export default function(api: GeneratorAPI, options: Required<RootOptions>): void {
  if (options.router) {
    api.extendPackage({
      dependencies: {
        "luban-router": "1.2.1",
      },
    });

    if (options.language === "js") {
      api.render("./template/js");
    }

    if (options.language === "ts") {
      api.render("./template/ts");
    }
  }
}
