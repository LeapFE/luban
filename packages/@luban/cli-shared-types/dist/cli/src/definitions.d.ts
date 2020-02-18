import { QuestionMap } from "inquirer";
import {
  RootOptions as rootOptions,
  RawPlugin as rawPlugin,
  Preset as preset,
} from "@luban-cli/cli-shared-types/dist/shared";
import { GeneratorAPI } from "./lib/generatorAPI";
export declare type CliOptions = Partial<{
  registry: string;
  skipGit: boolean;
  git: string;
  forceGit: boolean;
  force: boolean;
  localPlugin: boolean;
}>;
export declare type SUPPORTED_PACKAGE_MANAGER = "npm";
export declare type PACKAGE_MANAGER_CONFIG = {
  [K in SUPPORTED_PACKAGE_MANAGER]: {
    install: string[];
    add: string[];
    remove: string[];
    upgrade: string[];
  };
};
export declare type CONFIG_FILE_TYPE = "js" | "json" | "yaml" | "lines";
export declare type ESLinterConfig = "base" | "airbnb" | "standard";
export declare type DevLanguage = "js" | "ts";
export declare type CssPreprocessor = "less" | "styled-components";
export declare type UILibrary = "ant-design" | "ant-design-mobile";
export declare type RootOptions = rootOptions;
export declare type RawPlugin = rawPlugin;
export declare type Preset = preset;
export declare type PLUGIN_ID = keyof RawPlugin;
interface ApplyFn {
  (api: GeneratorAPI, rootOptions: RootOptions): void;
  hooks?: (api: GeneratorAPI, rootOptions: RootOptions, pluginIds: string[]) => void;
}
export declare type ResolvedPlugin = {
  id: keyof RawPlugin;
  apply: ApplyFn;
  options: RawPlugin[keyof RawPlugin] & Record<string, any>;
};
export declare type FinalAnswers = {
  language: DevLanguage;
  eslint: ESLinterConfig;
  cssPreprocessor: CssPreprocessor;
  stylelint: boolean;
  router: boolean;
  store: boolean;
  unitTest: boolean;
  uiLibrary: UILibrary[];
};
export declare type PromptCompleteCallback = (answer: FinalAnswers, options: Preset) => void;
export declare type InquirerQuestionType = keyof QuestionMap;
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
  ["__luban_config__"]?: Preset;
} & Record<string, any>;
export {};
