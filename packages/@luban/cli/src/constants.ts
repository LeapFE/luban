import { RootOptions, Preset } from "./definitions";

export const defaultPreset: Preset = {
  language: "ts",
  eslint: "standard",
  cssPreprocessor: "less",
  stylelint: true,
  router: true,
  store: true,
  unitTest: true,
  plugins: {
    "@luban-cli/cli-plugin-service": {},
    "@luban-cli/cli-plugin-babel": {},
    "@luban-cli/cli-plugin-eslint": {},
    "@luban-cli/cli-plugin-router": {},
    "@luban-cli/cli-plugin-store": {},
    "@luban-cli/cli-plugin-stylelint": {},
    "@luban-cli/cli-plugin-typescript": {},
    "@luban-cli/cli-plugin-unit-test": {},
  },
};

export const defaultRootOptions: Required<RootOptions> = {
  projectName: "",
  preset: defaultPreset,
};

export const confirmUseDefaultPresetMsg =
  "Will use default preset create project? \n" +
  "  (if you want to specify custom features with project, " +
  "cancel current operation and use `luban init <project_directory> -m` to create project)";
