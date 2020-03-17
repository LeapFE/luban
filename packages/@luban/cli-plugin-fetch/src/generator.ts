import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/src/lib/generatorAPI";
import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

export default function(api: GeneratorAPI, options: Required<RootOptions>): void {
  api.extendPackage({
    dependencies: {
      axios: "^0.19.2",
    },
  });

  if (options.preset.language === "ts") {
    api.extendPackage({
      devDependencies: {
        "@types/axios": "^0.14.0",
      },
    });
  }

  if (options.preset.language === "js") {
    api.render("./template/js");
  }

  if (options.preset.language === "ts") {
    api.render("./template/ts");
  }
}
