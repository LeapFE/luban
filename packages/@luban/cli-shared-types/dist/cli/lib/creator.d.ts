import { ExecaChildProcess } from "execa";
import { QuestionCollection, ListQuestion, CheckboxQuestion, DistinctQuestion } from "inquirer";
import { PromptModuleAPI } from "./promptModuleAPI";
import { CliOptions, Preset, RawPlugin, ResolvedPlugin, PromptCompleteCallback } from "../definitions";
declare type FeaturePrompt = CheckboxQuestion<Array<{
    name: string;
    value: any;
    short?: string;
}>>;
declare class Creator {
    private name;
    private readonly context;
    private options;
    readonly featurePrompt: FeaturePrompt;
    promptCompletedCallbacks: Array<PromptCompleteCallback>;
    private readonly outroPrompts;
    readonly injectedPrompts: DistinctQuestion[];
    private _pkgManager;
    private readonly installLocalPlugin;
    constructor(name: string, context: string, options: CliOptions, promptModules: Array<(api: PromptModuleAPI) => void>);
    create(): Promise<void>;
    run(command: string, args?: any): ExecaChildProcess;
    formatConfigFiles(preset: Required<Preset>): Promise<void>;
    fixLintErrors(preset: Required<Preset>): Promise<void>;
    promptAndResolvePreset(manual: boolean): Promise<Required<Preset>>;
    confirmUseDefaultPrest(): Promise<boolean>;
    shouldInitGit(cliOptions: CliOptions): boolean;
    resolveFinalPrompts(): QuestionCollection;
    resolveOutroPrompts(): ListQuestion[];
    resolvePlugins(rawPlugins: RawPlugin): Promise<ResolvedPlugin[]>;
}
export { Creator };
