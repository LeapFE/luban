import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/src/lib/generatorAPI";
import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

export default function(api: GeneratorAPI, options: Required<RootOptions>): void {
  api.extendPackage({
    dependencies: {
      "react-redux": "^7.2.0",
      "@rematch/core": "^1.4.0",
    },
  });

  if (options.preset.language === "ts") {
    api.extendPackage({
      devDependencies: {
        "@types/react-redux": "^7.1.7",
      },
    });

    api.render("./template/ts", { useRouter: options.preset.router });
  }

  if (options.preset.language === "js") {
    api.render("./template/js", { useRouter: options.preset.router });
  }
}
