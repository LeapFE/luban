import { QuestionMap } from "inquirer";
import {
  RootOptions as rootOptions,
  RawPlugin as rawPlugin,
  Preset as preset,
} from "@luban/cli-shared-types/dist/shared";

import { GeneratorAPI } from "./lib/generatorAPI";

export type CliOptions = Partial<{
  // 指定安装依赖时的 npm 源，仅限于 npm
  registry: string;

  // 跳过 git init，当指定 git 选项时，此项无效
  skipGit: boolean;

  // 指定生成项目时首次的 git commit message
  git: string;

  // 当指定首次的 git commit message 时，此项为 TRUE
  forceGit: boolean;

  // 如果指定项目名称与磁盘上的目录相同，force 为 TRUE 时将重写目标目录
  force: boolean;

  // 创建项目时安装插件时下载本地插件，仅仅是为了测试
  localPlugin: boolean;
}>;

/**
 * @type 支持的 npm 客户端
 */
export type SUPPORTED_PACKAGE_MANAGER = "npm";

export type PACKAGE_MANAGER_CONFIG = {
  [K in SUPPORTED_PACKAGE_MANAGER]: {
    install: string[];
    add: string[];
    remove: string[];
    upgrade: string[];
  };
};

/**
 * @type 工具配置文件的文件名后缀
 * @example babel.config.js .babel.yaml .babelrc
 */
export type CONFIG_FILE_TYPE = "js" | "json" | "yaml" | "lines";

export type ESLinterConfig = "base" | "airbnb" | "standard";

export type DevLanguage = "js" | "ts";

export type CssPreprocessor = "less" | "styled-components";

export type UILibrary = "ant-design" | "ant-design-mobile";

export type RootOptions = rootOptions;

export type RawPlugin = rawPlugin;

/**
 * @description 创建项目时的预设选项和插件的配置选项
 */
export type Preset = preset;

export type PLUGIN_ID = keyof RawPlugin;

interface ApplyFn {
  (api: GeneratorAPI, rootOptions: RootOptions): void;
  hooks?: (api: GeneratorAPI, rootOptions: RootOptions, pluginIds: string[]) => void;
}

export type ResolvedPlugin = {
  id: keyof RawPlugin;
  apply: ApplyFn;
  options: RawPlugin[keyof RawPlugin] & Record<string, any>;
};

export type FinalAnswers = {
  language: DevLanguage;
  eslint: ESLinterConfig;
  cssPreprocessor: CssPreprocessor;
  stylelint: boolean;
  router: boolean;
  store: boolean;
  unitTest: boolean;
  uiLibrary: UILibrary[];
};

export type PromptCompleteCallback = (answer: FinalAnswers, options: Preset) => void;

export type InquirerQuestionType = keyof QuestionMap;

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
  ["__luban_config__"]?: Preset;
} & Record<string, any>;
