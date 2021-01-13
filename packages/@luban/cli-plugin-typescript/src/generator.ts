import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/lib/generator/generatorAPI";
import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

export default function(api: GeneratorAPI, options: Required<RootOptions>): void {
  api.render("./template");

  if (options.cssSolution === "styled-components") {
    api.extendPackage({
      devDependencies: {
        "@types/styled-components": "^4.4.0",
      },
    });
  }

  api.extendPackage({
    scripts: {
      compile: "tsc --noEmit --diagnostics",
    },
    devDependencies: {
      "@types/react": "^16.9.35",
      "@types/react-dom": "^16.9.8",
      typescript: "~3.8.3",
      "ts-loader": "^7.0.0",
    },
  });
}
