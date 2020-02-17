import { Service } from "./Service";
import { WebpackChainCallback, WebpackRawConfigCallback, WebpackDevServerConfigCallback, CommandFn, WebpackConfiguration, Preset, PLUGIN_IDS, CliArgs } from "../definitions";
import Config from "webpack-chain";
declare class PluginAPI {
    id: string;
    service: Service;
    hasNoAnyFeatures: boolean;
    constructor(id: string, service: Service);
    getCwd(): string;
    resolve(_path: string): string;
    hasPlugin(id: PLUGIN_IDS): boolean;
    isTSProject(): boolean;
    useTsWithBabel(): boolean;
    resolveInitConfig(): Preset;
    getEntryFile(): string;
    setMode(mode: string): void;
    registerCommand(name: string, opts: Record<string, any> | null | CommandFn<CliArgs>, fn: CommandFn<CliArgs>): void;
    chainWebpack(fn: WebpackChainCallback): void;
    configureWebpack(fn: WebpackRawConfigCallback): void;
    resolveChainableWebpackConfig(): Config;
    resolveWebpackConfig(config?: Config): WebpackConfiguration;
    configureDevServer(fn: WebpackDevServerConfigCallback): void;
}
export { PluginAPI };
