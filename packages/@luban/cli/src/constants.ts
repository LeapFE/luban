import { RootOptions } from "./definitions";

export const defaultRootOptions: Required<RootOptions> = {
  projectName: "",
  preset: {
    language: "ts",
    eslint: "standard",
    cssPreprocessor: "less",
    stylelint: true,
    router: true,
    store: true,
    unitTest: true,
    plugins: {
      "@luban/cli-plugin-service": {},
    },
  },
};
