import { QuestionMap } from "inquirer";
import {
  RootOptions as rootOptions,
  RawPlugin as rawPlugin,
  Preset as preset,
  ESLinterConfig as esLinterConfig,
  DevLanguage as devLanguage,
  CssSolution as cssSolution,
  UILibrary as uiLibrary,
  BasePkgFields as basePkgFields,
} from "@luban-cli/cli-shared-types/dist/shared";

import { GeneratorAPI } from "./lib/generatorAPI";

export type CliOptions = Partial<{
  /**
   * @description specified npm registry when installing dependencies (only for npm)
   */
  registry: string;

  /**
   * @description Skip git initialization, invalid when specified `git` option
   */
  skipGit: boolean;

  /**
   * @description Force git initialization with initial commit message
   */
  git: string;

  /**
   * @description value will be TRUE when specified init git commit message
   */
  forceGit: boolean;

  /**
   * @description if specified project name are same as dir name on disk, it will override target dir when this option be TRUE
   */
  force: boolean;

  // 创建项目时安装插件时下载本地插件，仅仅是为了测试
  /**
   * @description will install local plugins while create project for test or debug
   */
  localPlugin: boolean;

  /**
   * @description Manual select features while create project
   */
  manual?: boolean;
}>;

export type SUPPORTED_PACKAGE_MANAGER = "npm";

export type PACKAGE_MANAGER_CONFIG = {
  [K in SUPPORTED_PACKAGE_MANAGER]: {
    install: string[];
    add: string[];
    remove: string[];
    upgrade: string[];
  };
};

export type CONFIG_FILE_TYPE = "js" | "json" | "yaml" | "lines";

export type ESLinterConfig = esLinterConfig;

export type DevLanguage = devLanguage;

export type CssSolution = cssSolution;

export type UILibrary = uiLibrary;

export type RootOptions = rootOptions;

export type RawPlugin = rawPlugin;

export type Preset = preset;

export type PLUGIN_ID = keyof RawPlugin;

export interface ApplyFn {
  (api: GeneratorAPI, rootOptions: RootOptions): void;
  /**
   * @deprecated
   */
  hooks?: (api: GeneratorAPI, rootOptions: RootOptions, pluginIds: string[]) => void;
}

export type ResolvedPlugin = {
  id: keyof RawPlugin;
  apply: ApplyFn;
  options: RawPlugin[keyof RawPlugin] & Record<string, any>;
};

// TYPE REVIEW
export type FinalAnswers = {
  language: DevLanguage;
  eslint: ESLinterConfig;
  cssSolution: CssSolution;
  stylelint: boolean;
  router: boolean;
  store: boolean;
  unitTest: boolean;
  fetch: boolean;
  commit: boolean;
};

export type PromptCompleteCallback = (answer: FinalAnswers, options: Preset) => void;

export type InquirerQuestionType = keyof QuestionMap;

export type BasePkgFields = basePkgFields;
