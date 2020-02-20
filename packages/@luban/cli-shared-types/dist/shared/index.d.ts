export declare type RootOptions = {
    projectName?: string;
    preset?: Required<Preset>;
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
export declare type ESLinterConfig = "airbnb" | "standard";
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
};
export declare type BasePkgFields = {
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
    ["__USE_LOCAL_PLUGIN__"]?: boolean;
} & Record<string, any>;
