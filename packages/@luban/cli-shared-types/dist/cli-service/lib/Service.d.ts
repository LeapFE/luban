import Config from "webpack-chain";
import { BasePkgFields, InlinePlugin, ProjectConfig, WebpackChainCallback, WebpackDevServerConfigCallback, WebpackRawConfigCallback, CommandList, ServicePlugin, Preset, ParsedArgs, CliArgs, WebpackConfiguration, builtinServiceCommandName } from "./../definitions";
declare type ResetParams = Partial<{
    plugins: InlinePlugin[];
    pkg: BasePkgFields;
    projectOptions: ProjectConfig;
    useBuiltIn: boolean;
}>;
declare class Service {
    context: string;
    pkg: BasePkgFields;
    webpackConfig: Config;
    webpackChainCallback: WebpackChainCallback[];
    webpackRawConfigCallback: WebpackRawConfigCallback[];
    webpackDevServerConfigCallback: WebpackDevServerConfigCallback[];
    commands: Partial<CommandList<CliArgs>>;
    projectConfig: ProjectConfig;
    plugins: ServicePlugin[];
    mode: string;
    private inlineProjectOptions?;
    private configFilename;
    constructor(context: string, { plugins, pkg, projectOptions, useBuiltIn }: ResetParams);
    private init;
    run(name?: builtinServiceCommandName, args?: ParsedArgs, rawArgv?: string[]): Promise<void>;
    resolvePlugins(inlinePlugins: InlinePlugin[], useBuiltIn: boolean): ServicePlugin[];
    resolveChainableWebpackConfig(): Config;
    resolveWebpackConfig(chainableConfig?: Config): WebpackConfiguration;
    resolvePkg(inlinePkg?: BasePkgFields): BasePkgFields;
    loadAndSetEnv(mode: string, commandName: builtinServiceCommandName): void;
    loadProjectOptions(inlineOptions?: ProjectConfig): ProjectConfig;
    resolveLubanConfig(): Required<Preset>;
}
export { Service };
