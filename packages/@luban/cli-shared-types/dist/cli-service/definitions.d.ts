import Config from "webpack-chain";
import webpack from "webpack";
import webpackDevServer, { Configuration as WebpackDevServerConfig } from "webpack-dev-server";
import { Application } from "express";
import { RootOptions as rootOptions, RawPlugin as rawPlugin, Preset as preset, BasePkgFields as basePkgFields } from "@luban-cli/cli-shared-types/dist/shared";
import { PluginAPI } from "./lib/PluginAPI";
import { defaultsProjectConfig } from "./lib/options";
export declare type builtinServiceCommandName = "serve" | "build" | "inspect" | "help";
export declare type RootOptions = rootOptions;
export declare type RawPlugin = rawPlugin;
export declare type BasePkgFields = basePkgFields;
export declare type PluginApplyCallback = (api: PluginAPI, options: Record<string, any>) => void;
export declare type InlinePlugin = {
    id: string;
    apply: PluginApplyCallback;
};
export declare type ServicePlugin = InlinePlugin;
export declare type WebpackChainCallback = (config: Config) => void;
export declare type WebpackRawConfigCallback = ((config: webpack.Configuration) => webpack.Configuration | undefined) | webpack.Configuration;
export declare type WebpackDevServerConfigCallback = (app: Application, server: webpackDevServer) => void;
export declare type CommandCallback<P> = (args: ParsedArgs<P>, rawArgv: string[]) => void;
export declare type CommandList<P> = Record<builtinServiceCommandName, {
    commandCallback: CommandCallback<P>;
    opts: Record<string, any> | null | PluginApplyCallback;
}>;
export declare type DefaultProjectConfig = Partial<typeof defaultsProjectConfig>;
export declare type WebpackConfiguration = webpack.Configuration & {
    devServer?: WebpackDevServerConfig;
};
declare type OptionsOfCssLoader = {
    css: Record<string, any>;
    less: Record<string, any>;
    postcss: Record<string, any>;
    miniCss: Record<string, any>;
};
declare type CssConfig = {
    extract?: boolean;
    sourceMap?: boolean;
    loaderOptions: OptionsOfCssLoader;
};
export declare type ProjectConfig = {
    publicPath: string;
    outputDir?: string;
    indexPath: string;
    productionSourceMap: boolean;
    configureWebpack?: WebpackConfiguration | ((config: WebpackConfiguration) => WebpackConfiguration);
    chainWebpack?: (config: Config) => void;
    css: CssConfig;
    devServer: WebpackDevServerConfig;
    assetsLimit: number;
    alias: Record<string, string>;
};
export declare type ServeCliArgs = Partial<{
    entry: string;
    open: boolean;
    mode: string;
    host: string;
    port: string;
    https: boolean;
    public: string;
    help: boolean;
}>;
export declare type BuildCliArgs = Partial<{
    entry: string;
    mode: string;
    dest: string;
    report: boolean;
    help: boolean;
}>;
export declare type InspectCliArgs = Partial<{
    mode: string;
    rule: string;
    plugin: string;
    rules: string[];
    plugins: string[];
    verbose: boolean;
    help: boolean;
}>;
export declare type Preset = preset;
export declare type PLUGIN_IDS = keyof RawPlugin;
export declare type CliArgs = ServeCliArgs | BuildCliArgs | InspectCliArgs;
export declare type ParsedArgs<T extends Record<string | number, any> = CliArgs> = {
    [K in keyof T]: T[K];
} & {
    "--"?: string[];
    _: string[];
};
export declare type UrlLoaderOptions = {
    limit: number;
    fallback: {
        loader: string;
        options: {
            name: string;
        };
    };
};
export {};
