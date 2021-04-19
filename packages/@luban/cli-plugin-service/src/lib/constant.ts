import { BasePkgFields, builtinServiceCommandName, RootOptions } from "../definitions";

export const defaultPackageFields: BasePkgFields = {
  name: "",
  version: "",
};

export const builtInCommandPluginsRelativePath = "./../commands/*";

export const builtInConfigPluginsRelativePath = "./../config/*";

export const builtinServiceCommandNameList = new Set<builtinServiceCommandName>([
  "build",
  "inspect",
  "serve",
  "help",
]);

export const defaultRootOptions: Required<RootOptions> = {
  projectName: "",
  eslint: "standard",
  stylelint: true,
  unitTest: true,
  fetch: true,
  commit: true,
  type: "web",
  plugins: {
    "@luban-cli/cli-plugin-service": {
      projectName: "",
    },
    "@luban-cli/cli-plugin-babel": {},
    "@luban-cli/cli-plugin-eslint": {},
    "@luban-cli/cli-plugin-stylelint": {},
    "@luban-cli/cli-plugin-unit-test": {},
    "@luban-cli/cli-plugin-commit": {},
  },
};
