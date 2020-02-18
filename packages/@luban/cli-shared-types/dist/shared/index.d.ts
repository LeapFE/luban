export declare type RootOptions = {
  projectName?: string;
  preset?: Preset;
};
export declare type RawPlugin = {
  "@luban-cli/cli-plugin-babel"?: Record<string, any>;
  "@luban-cli/cli-plugin-typescript"?: Record<string, any>;
  "@luban-cli/cli-plugin-eslint"?: Record<string, any>;
  "@luban-cli/cli-plugin-stylelint"?: Record<string, any>;
  "@luban-cli/cli-plugin-router"?: Record<string, any>;
  "@luban-cli/cli-plugin-store"?: Record<string, any>;
  "@luban-cli/cli-plugin-unit-test"?: Record<string, any>;
  "@luban-cli/cli-plugin-service": RootOptions;
};
export declare type ESLinterConfig = "base" | "airbnb" | "standard";
export declare type DevLanguage = "js" | "ts";
export declare type CssPreprocessor = "less" | "styled-components";
export declare type UILibrary = "ant-design" | "ant-design-mobile";
export declare type Preset = {
  language?: DevLanguage;
  eslint?: ESLinterConfig;
  cssPreprocessor?: CssPreprocessor;
  stylelint?: boolean;
  router?: boolean;
  store?: boolean;
  unitTest?: boolean;
  uiLibrary?: UILibrary[];
  plugins: RawPlugin;
  configs?: Record<string, any>;
};
