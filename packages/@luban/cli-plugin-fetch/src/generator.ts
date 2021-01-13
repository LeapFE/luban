import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/lib/generator/generatorAPI";
import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

export default function(api: GeneratorAPI, options: Required<RootOptions>): void {
  api.extendPackage({
    dependencies: {
      axios: "^0.19.2",
      "@luban-hooks/use-request": "^1.1.2",
    },
  });

  if (options.language === "js") {
    api.render("./template/js");
  }
  if (options.language === "ts") {
    api.render("./template/ts");
  }
}
