import Config from "webpack-chain";
import { Service } from "./Service";
import { WebpackChainCallback, WebpackRawConfigCallback, WebpackDevServerConfigCallback, CommandCallback, WebpackConfiguration, Preset, PLUGIN_IDS, CliArgs, builtinServiceCommandName } from "../definitions";
declare class PluginAPI {
    id: string;
    service: Service;
    constructor(id: string, service: Service);
    getCwd(): string;
    resolve(_path: string): string;
    hasPlugin(id: PLUGIN_IDS): boolean;
    resolveInitConfig(): Required<Preset>;
    getEntryFile(): string;
    setMode(mode: string, commandName: builtinServiceCommandName): void;
    registerCommand(name: builtinServiceCommandName, opts: Record<string, any> | CommandCallback<CliArgs> | null, callback?: CommandCallback<CliArgs>): void;
    chainWebpack(fn: WebpackChainCallback): void;
    configureWebpack(fn: WebpackRawConfigCallback): void;
    resolveChainableWebpackConfig(): Config;
    resolveWebpackConfig(config?: Config): WebpackConfiguration;
    configureDevServer(fn: WebpackDevServerConfigCallback): void;
}
export { PluginAPI };
