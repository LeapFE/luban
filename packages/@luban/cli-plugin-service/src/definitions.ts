import Config = require("webpack-chain");
import webpack = require("webpack");
import WebpackDevServer from "webpack-dev-server";
import { StaticRouterContext } from "react-router";
import { RematchStore } from "@rematch/core";

import {
  RootOptions as rootOptions,
  RawPlugin as rawPlugin,
  Preset as preset,
  BasePkgFields as basePkgFields,
} from "@luban-cli/cli-shared-types/dist/shared";

import { CommandPluginAPI, ConfigPluginAPI } from "./lib/PluginAPI";
import { ProjectConfig } from "./main";

export type builtinServiceCommandName = "serve" | "build" | "inspect" | "help";

export type RootOptions = rootOptions;

export type RawPlugin = rawPlugin;

/**
 * @description package.json fields, name and version must required
 *
 * @see https://docs.npmjs.com/creating-a-package-json-file
 */
export type BasePkgFields = basePkgFields;

export type CommonFields<Args extends CliArgs> = {
  projectConfig: ProjectConfig;
  options: rootOptions;
  mode: string;
  commandName: builtinServiceCommandName;
  args: ParsedArgs<Args>;
  rawArgv: string[];
};

export type CommandPluginApplyCallbackArgs<Args extends CliArgs> = {
  api: CommandPluginAPI;
} & CommonFields<Args>;

export type CommandPluginApplyCallback<Args extends CliArgs> = (
  options: CommandPluginApplyCallbackArgs<Args>,
) => void;

export interface CommandPluginInstance<Args extends CliArgs> {
  apply: CommandPluginApplyCallback<Args>;
}

export type CommandPlugin<Args extends CliArgs> = {
  id: string;
  instance: CommandPluginInstance<Args>;
};
export type ConfigPluginApplyCallbackArgs<Args extends CliArgs = CliArgs> = {
  api: ConfigPluginAPI;
} & CommonFields<Args>;
export type ConfigPluginApplyCallback<Args extends CliArgs = CliArgs> = (
  options: ConfigPluginApplyCallbackArgs<Args>,
) => void;

export interface ConfigPluginInstance<Args extends CliArgs = CliArgs> {
  apply: ConfigPluginApplyCallback<Args>;
}

export type ConfigPlugin<Args extends CliArgs = CliArgs> = {
  id: string;
  instance: ConfigPluginInstance<Args>;
};

export type WebpackConfiguration = webpack.Configuration & {
  devServer?: WebpackDevServer.Configuration;
};

export type WebpackChainCallback = (config: Config) => void;

export type WebpackRawConfigCallback =
  | ((config: webpack.Configuration) => webpack.Configuration | void)
  | webpack.Configuration;

export type CommandCallback = () => void;

export type CommandList = Record<
  builtinServiceCommandName,
  {
    commandCallback: CommandCallback;
    opts: Record<string, unknown> | CommandCallback;
  }
>;

export type WebpackConfigName = "client" | "server";
export type WebpackConfigItem = {
  config: Config;
  chainCallback: WebpackChainCallback[];
  rawCallback: WebpackRawConfigCallback[];
};
export type WebpackConfigList = Record<WebpackConfigName, WebpackConfigItem>;

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

export type ParsedArgs<T extends Record<string | number, unknown> = CliArgs> = {
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
export type Context = { path: string; initProps: {} };

export type ServerEntry = (
  req: Context,
  staticRouterContext: StaticRouterContext,
  store: RematchStore | null,
) => null | Promise<JSX.Element>;

export type ServerBundle = { default: ServerEntry; createStore?: () => RematchStore | null };
