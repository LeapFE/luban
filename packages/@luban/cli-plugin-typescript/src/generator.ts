import { GeneratorAPI } from "@luban/cli-shared-types/dist/cli/src/lib/generatorAPI";
import { RootOptions } from "@luban/cli-shared-types/dist/shared";

export default function(api: GeneratorAPI, options: Required<RootOptions>): void {

  api.render("./../../../template/typescript");

  if (options.preset.cssPreprocessor === "styled-components") {
    api.extendPackage({
      devDependencies: {
        "@types/styled-components": "^4.4.0",
      }
    })
  }

  api.extendPackage({
    devDependencies: {
      "@types/react": "^16.9.11",
      "@types/react-dom": "^16.9.4",
      typescript: "^3.7.2",
    },
  });
}
