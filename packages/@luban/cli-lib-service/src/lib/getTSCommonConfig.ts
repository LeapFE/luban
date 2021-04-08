import { getProjectTsConfigJson } from "./share";
import { Settings } from "gulp-typescript";

export function getTsConfig(isCommonjsModule: boolean): Settings {
  const externalConfig = getProjectTsConfigJson();

  return {
    noUnusedParameters: true,
    noUnusedLocals: true,
    strictNullChecks: true,
    jsx: "preserve",
    moduleResolution: "node",
    declaration: true,
    allowSyntheticDefaultImports: true,
    ...externalConfig.compilerOptions,
    module: isCommonjsModule ? "commonjs" : "esnext",
  };
}
