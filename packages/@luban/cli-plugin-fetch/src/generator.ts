import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/lib/generator/generatorAPI";

export default function (api: GeneratorAPI): void {
  api.extendPackage({
    dependencies: {
      axios: "^0.19.2",
      "@luban-hooks/use-request": "^1.1.7",
    },
  });

  api.render("./template");
}
