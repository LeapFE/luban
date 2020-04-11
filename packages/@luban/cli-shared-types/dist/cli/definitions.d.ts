import { QuestionMap } from "inquirer";
import { RootOptions as rootOptions, RawPlugin as rawPlugin, Preset as preset, ESLinterConfig as esLinterConfig, DevLanguage as devLanguage, CssSolution as cssSolution, UILibrary as uiLibrary, BasePkgFields as basePkgFields } from "@luban-cli/cli-shared-types/dist/shared";
import { GeneratorAPI } from "./lib/generatorAPI";
export declare type CliOptions = Partial<{
    registry: string;
    skipGit: boolean;
    git: string;
    forceGit: boolean;
    force: boolean;
    localPlugin: boolean;
    manual?: boolean;
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
export declare type ESLinterConfig = esLinterConfig;
export declare type DevLanguage = devLanguage;
export declare type CssSolution = cssSolution;
export declare type UILibrary = uiLibrary;
export declare type RootOptions = rootOptions;
export declare type RawPlugin = rawPlugin;
export declare type Preset = preset;
export declare type PLUGIN_ID = keyof RawPlugin;
export interface ApplyFn {
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
    cssSolution: CssSolution;
    stylelint: boolean;
    router: boolean;
    store: boolean;
    unitTest: boolean;
    fetch: boolean;
};
export declare type PromptCompleteCallback = (answer: FinalAnswers, options: Preset) => void;
export declare type InquirerQuestionType = keyof QuestionMap;
export declare type BasePkgFields = basePkgFields;
