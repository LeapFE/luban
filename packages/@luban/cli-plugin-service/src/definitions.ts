import Config from "webpack-chain";
import webpack from "webpack";
import webpackDevServer, { Configuration as WebpackDevServerConfig } from "webpack-dev-server";
import { Application } from "express";

import {
  RootOptions as rootOptions,
  RawPlugin as rawPlugin,
  Preset as preset,
  BasePkgFields as basePkgFields,
} from "@luban-cli/cli-shared-types/dist/shared";

import { PluginAPI } from "./lib/PluginAPI";

import { defaultsProjectConfig } from "./lib/options";

export type builtinServiceCommandName = "serve" | "build" | "inspect" | "help";

export type RootOptions = rootOptions;

export type RawPlugin = rawPlugin;

/**
 * @description package.json fields, name and version must required
 *
 * @see https://docs.npmjs.com/creating-a-package-json-file
 */
export type BasePkgFields = basePkgFields;

export type WebpackConfiguration = webpack.Configuration & { devServer?: WebpackDevServerConfig };

export type PluginApplyCallback = (api: PluginAPI, options: Record<string, any>) => void;
export type InlinePlugin = {
  id: string;
  apply: PluginApplyCallback;
};
export type ServicePlugin = InlinePlugin;
export type WebpackChainCallback = (config: Config) => void;
export type WebpackRawConfigCallback =
  | ((config: WebpackConfiguration) => WebpackConfiguration | undefined)
  | WebpackConfiguration;
export type WebpackDevServerConfigCallback = (app: Application, server: webpackDevServer) => void;
export type CommandCallback<P> = (args: ParsedArgs<P>, rawArgv: string[]) => void;
export type CommandList<P> = Record<
  builtinServiceCommandName,
  {
    commandCallback: CommandCallback<P>;
    opts: Record<string, any> | null | PluginApplyCallback;
  }
>;
export type DefaultProjectConfig = Partial<typeof defaultsProjectConfig>;

export type ServeCliArgs = Partial<{
  entry: string;
  config: string;
  open: boolean;
  mode: string;
  host: string;
  port: string;
  https: boolean;
  public: string;
  help: boolean;
}>;

export type BuildCliArgs = Partial<{
  entry: string;
  config: string;
  mode: string;
  dest: string;
  report: boolean;
  help: boolean;
}>;

export type InspectCliArgs = Partial<{
  mode: string;
  config: string;
  rule: string;
  plugin: string;
  rules: string[];
  plugins: string[];
  verbose: boolean;
  help: boolean;
}>;

export type Preset = preset;

export type PLUGIN_IDS = keyof RawPlugin;

export type CliArgs = ServeCliArgs | BuildCliArgs | InspectCliArgs;

export type ParsedArgs<T extends Record<string | number, any> = CliArgs> = {
  [K in keyof T]: T[K];
} & {
  "--"?: string[];

  _: string[];
};

export type UrlLoaderOptions = {
  limit: number;
  fallback: {
    loader: string;
    options: {
      name: string;
    };
  };
};
