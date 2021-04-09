import { RootOptions, Preset } from "./definitions";

// default preset for webapp
export const defaultPreset: Required<Preset> = {
  eslint: "leap",
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
    "@luban-cli/cli-plugin-fetch": {},
    "@luban-cli/cli-plugin-commit": {},
  },
};

// default preset for lib
export const defaultPresetForLib: Required<Preset> = {
  eslint: "leap",
  stylelint: true,
  unitTest: true,
  fetch: false,
  commit: true,
  type: "lib",
  plugins: {
    "@luban-cli/cli-lib-service": {
      projectName: "",
    },
    "@luban-cli/cli-plugin-eslint": {},
    "@luban-cli/cli-plugin-stylelint": {},
    "@luban-cli/cli-plugin-unit-test": {},
    "@luban-cli/cli-plugin-commit": {},
  },
};

export const defaultPresetNameMap: Record<keyof Omit<Omit<Preset, "plugins">, "type">, string> = {
  eslint: "eslint config",
  stylelint: "use stylelint",
  unitTest: "use unit testing(based on Jest + Enzyme)",
  fetch: "built-in async data fetching(based on Axios + useRequest)",
  commit: "commit with commitizen and lint commit messages by commitlint",
};

export const defaultPromptModule: Array<keyof Preset> = [
  "eslint",
  "stylelint",
  "unitTest",
  "fetch",
  "commit",
];

export const libDefaultPromptModule = ["commit", "eslint", "stylelint"];

// default root options for webapp
export const defaultRootOptions: Required<RootOptions> = {
  projectName: "",
  eslint: "leap",
  stylelint: true,
  unitTest: true,
  fetch: true,
  commit: true,
  type: "web",
  plugins: {
    "@luban-cli/cli-plugin-service": {
      projectName: "",
    },
  },
};

export const defaultRootOptionsForLib: Required<RootOptions> = {
  projectName: "",
  eslint: "leap",
  stylelint: true,
  unitTest: false,
  fetch: false,
  commit: true,
  type: "lib",
  plugins: {
    "@luban-cli/cli-lib-service": {
      projectName: "",
    },
  },
};

export const confirmUseDefaultPresetMsg =
  "Will use default preset create project? \n" +
  "  (if you want to specify custom features with project, " +
  "cancel current operation and use `luban init <project_directory> -m` to create project)";
