import Config from "webpack-chain";
import webpack from "webpack";
import webpackDevServer, { Configuration as WebpackDevServerConfig } from "webpack-dev-server";
import { Application } from "express";
import { PluginAPI } from "./lib/PluginAPI";
import { defaultsProjectConfig } from "./lib/options";
export declare type RootOptions = {
  projectName?: string;
  preset?: Preset;
};
export declare type RawPlugin = {
  "@luban-cli/cli-plugin-babel"?: Record<string, any>;
  "@luban-cli/cli-plugin-typescript"?: Record<string, any>;
  "@luban-cli/cli-plugin-eslint"?: Record<string, any>;
  "@luban-cli/cli-plugin-stylelint"?: Record<string, any>;
  "@luban-cli/cli-plugin-router"?: Record<string, any>;
  "@luban-cli/cli-plugin-store"?: Record<string, any>;
  "@luban-cli/cli-plugin-unit-test"?: Record<string, any>;
  "@luban-cli/cli-plugin-service": RootOptions;
};
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
export declare type PluginApplyCallback = (api: PluginAPI, options: Record<string, any>) => void;
export declare type InlinePlugin = {
  id: string;
  apply: PluginApplyCallback;
};
export declare type ServicePlugin = InlinePlugin;
export declare type WebpackChainCallback = (config: Config) => void;
export declare type WebpackRawConfigCallback =
  | ((config: webpack.Configuration) => webpack.Configuration | undefined)
  | webpack.Configuration;
export declare type WebpackDevServerConfigCallback = (
  app: Application,
  server: webpackDevServer,
) => void;
export declare type CommandFn<P> = (args: ParsedArgs<P>, rawArgv: string[]) => void;
export declare type CommandList<P> = Record<
  string,
  {
    fn: CommandFn<P>;
    opts: Record<string, any> | null | PluginApplyCallback;
  }
>;
export declare type DefaultProjectConfig = Partial<typeof defaultsProjectConfig>;
export declare type WebpackConfiguration = webpack.Configuration;
declare type OptionsOfCssLoader = {
  css: Record<string, any>;
  less: Record<string, any>;
  postcss: Record<string, any>;
  miniCss: Record<string, any>;
};
declare type CssConfig = {
  extract: boolean;
  sourceMap: boolean;
  loaderOptions: OptionsOfCssLoader;
};
export declare type ProjectConfig = {
  publicPath: string;
  outputDir?: string;
  assetsDir: string;
  indexPath: string;
  productionSourceMap: boolean;
  configureWebpack?:
    | WebpackConfiguration
    | ((config: WebpackConfiguration) => WebpackConfiguration);
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
export declare type Preset = {
  useConfigFiles: boolean;
  cssPreprocessor?: "less" | "styled-components";
  plugins: RawPlugin;
  configs?: Record<string, string>;
};
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
