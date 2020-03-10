export type RootOptions = { projectName?: string; preset?: Required<Preset> };

export type RawPlugin = {
  "@luban-cli/cli-plugin-babel"?: Record<string, any>;
  "@luban-cli/cli-plugin-typescript"?: Record<string, any>;
  "@luban-cli/cli-plugin-eslint"?: Record<string, any>;
  "@luban-cli/cli-plugin-stylelint"?: Record<string, any>;
  "@luban-cli/cli-plugin-router"?: Record<string, any>;
  "@luban-cli/cli-plugin-store"?: Record<string, any>;
  "@luban-cli/cli-plugin-unit-test"?: Record<string, any>;
  "@luban-cli/cli-plugin-service": RootOptions;
};

export type ESLinterConfig = "airbnb" | "standard";

export type DevLanguage = "js" | "ts";

export type CssPreprocessor = "less" | "styled-components";

/**
 * @deprecated
 */
export type UILibrary = "ant-design" | "ant-design-mobile";

/**
 * @description 创建项目时的预设选项和插件的配置选项
 */
export type Preset = {
  language?: DevLanguage;
  eslint?: ESLinterConfig;
  cssPreprocessor?: CssPreprocessor;
  stylelint?: boolean;
  router?: boolean;
  store?: boolean;
  unitTest?: boolean;
  // uiLibrary?: UILibrary[];
  plugins: RawPlugin;
};

/**
 * @description package.json fields, name and version must required
 *
 * @see https://docs.npmjs.com/creating-a-package-json-file
 */
export type BasePkgFields = {
  name: string;
  description?: "";
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
  ["__luban_config__"]?: Required<Preset>;
  /**
   * @deprecated
   */
  ["__USE_LOCAL_PLUGIN__"]?: boolean;
} & Record<string, any>;
