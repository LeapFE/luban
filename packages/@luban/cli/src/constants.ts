import { RootOptions, Preset } from "./definitions";

export const defaultPreset: Required<Preset> = {
  language: "ts",
  eslint: "airbnb",
  cssPreprocessor: "less",
  stylelint: true,
  router: true,
  store: true,
  unitTest: true,
  fetch: true,
  plugins: {
    "@luban-cli/cli-plugin-service": {},
    "@luban-cli/cli-plugin-babel": {},
    "@luban-cli/cli-plugin-eslint": {},
    "@luban-cli/cli-plugin-router": {},
    "@luban-cli/cli-plugin-store": {},
    "@luban-cli/cli-plugin-stylelint": {},
    "@luban-cli/cli-plugin-typescript": {},
    "@luban-cli/cli-plugin-unit-test": {},
    "@luban-cli/cli-plugin-fetch": {},
  },
};

export const defaultPresetNameMap: Record<keyof Omit<Preset, "plugins">, string> = {
  language: "development language",
  eslint: "eslint config",
  cssPreprocessor: "css pre-processor",
  stylelint: "use stylelint",
  router: "use router(based on React-Router)",
  store: "use centralized store(based on rematch)",
  unitTest: "use unit testing(based on Jest + Enzyme)",
  fetch: "built-in data fetching(based on Axios)",
};

// TODO add prompt module apiRequest, named fetch
export const defaultPromptModule: Array<keyof Preset> = [
  "language",
  "eslint",
  "cssPreprocessor",
  "stylelint",
  "router",
  "store",
  "unitTest",
  "fetch",
];

export const defaultRootOptions: Required<RootOptions> = {
  projectName: "",
  preset: defaultPreset,
};

export const confirmUseDefaultPresetMsg =
  "Will use default preset create project? \n" +
  "  (if you want to specify custom features with project, " +
  "cancel current operation and use `luban init <project_directory> -m` to create project)";
