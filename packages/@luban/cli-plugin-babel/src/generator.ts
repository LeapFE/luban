import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/lib/generator/generatorAPI";
// import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

export default function(api: GeneratorAPI): void {
  api.extendPackage({
    devDependencies: {
      "@babel/cli": "^7.13.14",
      "@babel/core": "^7.13.15",
      "@babel/plugin-transform-runtime": "^7.13.15",
      "@babel/preset-env": "^7.13.15",
      "@babel/preset-typescript": "^7.8.0",
      "@babel/runtime": "^7.13.10",
      "@babel/preset-react": "^7.13.13",
      "core-js": "^3.10.1",
      "babel-loader": "^8.2.2",
      "react-refresh": "^0.9.0",
      "@babel/plugin-proposal-class-properties": "^7.13.0",
    },
  });

  api.render("./template");
}
