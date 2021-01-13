import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/lib/generator/generatorAPI";
import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

export default function(api: GeneratorAPI, options: Required<RootOptions>): void {
  api.extendPackage({
    dependencies: {
      "react-redux": "^7.2.0",
      "@rematch/core": "^1.4.0",
    },
  });

  if (options.language === "ts") {
    api.extendPackage({
      devDependencies: {
        "@types/react-redux": "^7.1.7",
      },
    });

    api.render("./template/ts", { useRouter: options.router });
  }

  if (options.language === "js") {
    api.render("./template/js", { useRouter: options.router });
  }
}
