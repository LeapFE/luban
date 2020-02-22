import Config from "webpack-chain";
import { BasePkgFields, InlinePlugin, ProjectConfig, WebpackChainCallback, WebpackDevServerConfigCallback, WebpackRawConfigCallback, CommandList, ServicePlugin, Preset, ParsedArgs, CliArgs, WebpackConfiguration } from "./../definitions";
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
    commands: CommandList<CliArgs>;
    projectConfig: ProjectConfig;
    plugins: ServicePlugin[];
    mode: string;
    private inlineProjectOptions?;
    constructor(context: string, { plugins, pkg, projectOptions, useBuiltIn }: ResetParams);
    private init;
    run(name: string, args?: ParsedArgs, rawArgv?: string[]): Promise<void>;
    resolvePlugins(inlinePlugins: InlinePlugin[], useBuiltIn: boolean): ServicePlugin[];
    resolveChainableWebpackConfig(): Config;
    resolveWebpackConfig(chainableConfig?: Config): WebpackConfiguration;
    resolvePkg(inlinePkg?: BasePkgFields): BasePkgFields;
    loadEnv(mode?: string): void;
    loadProjectOptions(inlineOptions: ProjectConfig): ProjectConfig;
    resolveLubanConfig(): Required<Preset>;
}
export { Service };
