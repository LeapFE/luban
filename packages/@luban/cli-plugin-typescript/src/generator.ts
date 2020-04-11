import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/lib/generatorAPI";
import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

export default function(api: GeneratorAPI, options: Required<RootOptions>): void {
  api.render("./template");

  if (options.preset.cssSolution === "styled-components") {
    api.extendPackage({
      devDependencies: {
        "@types/styled-components": "^4.4.0",
      },
    });
  }

  api.extendPackage({
    devDependencies: {
      "@types/react": "^16.9.11",
      "@types/react-dom": "^16.9.4",
      typescript: "^3.7.2",
      "ts-loader": "^6.2.1",
    },
  });
}
