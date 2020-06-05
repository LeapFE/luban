export type RawPlugin = {
  "@luban-cli/cli-plugin-babel"?: Record<string, any>;
  "@luban-cli/cli-plugin-typescript"?: Record<string, any>;
  "@luban-cli/cli-plugin-eslint"?: Record<string, any>;
  "@luban-cli/cli-plugin-stylelint"?: Record<string, any>;
  "@luban-cli/cli-plugin-router"?: Record<string, any>;
  "@luban-cli/cli-plugin-store"?: Record<string, any>;
  "@luban-cli/cli-plugin-unit-test"?: Record<string, any>;
  "@luban-cli/cli-plugin-fetch"?: Record<string, any>;
  "@luban-cli/cli-plugin-commit"?: Record<string, any>;
  "@luban-cli/cli-plugin-service": { projectName: string } & Record<string, any>;
};

export type ESLinterConfig = "leap" | "airbnb" | "standard";

export type DevLanguage = "js" | "ts";

export type CssSolution = "less" | "styled-components";

/**
 * @deprecated
 */
export type UILibrary = "ant-design" | "ant-design-mobile";

/**
 * @description preset config and plugin options after created project
 */
export type Preset = {
  language?: DevLanguage;
  eslint?: ESLinterConfig;
  cssSolution?: CssSolution;
  stylelint?: boolean;
  router?: boolean;
  store?: boolean;
  unitTest?: boolean;
  fetch?: boolean;
  commit?: boolean;
  plugins: RawPlugin;
};

export type RootOptions = Preset & { projectName: string };

/**
 * @description package.json fields, name and version must required
 *
 * @see https://docs.npmjs.com/creating-a-package-json-file
 */
export type BasePkgFields = {
  name: string;
  description?: string;
  version: string;
  main?: string;
  scripts?: Record<string, string>;
  repository?: Record<string, string>;
  devDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;
  keywords?: string[];
  author?: string;
  browserslist?: string[];
  homepage?: string;
  ["__luban_config__"]?: Required<RootOptions>;
  /**
   * @deprecated
   */
  ["__USE_LOCAL_PLUGIN__"]?: boolean;
} & Record<string, any>;
