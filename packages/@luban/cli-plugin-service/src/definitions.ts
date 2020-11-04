import Config = require("webpack-chain");
import webpack = require("webpack");
import webpackDevServer = require("webpack-dev-server");
import { Application } from "express";
import WebpackDevServer from "webpack-dev-server";

import {
  RootOptions as rootOptions,
  RawPlugin as rawPlugin,
  Preset as preset,
  BasePkgFields as basePkgFields,
} from "@luban-cli/cli-shared-types/dist/shared";

import { PluginAPI } from "./lib/PluginAPI";
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

export type PluginApplyCallback = (api: PluginAPI, options: ProjectConfig) => void;

export type InlinePlugin = {
  id: string;
  apply: PluginApplyCallback;
};

export type ServicePlugin = InlinePlugin;

export type WebpackConfiguration = webpack.Configuration & {
  devServer?: WebpackDevServer.Configuration;
};

export type WebpackChainCallback = (config: Config) => void;

export type WebpackRawConfigCallback =
  | ((config: webpack.Configuration) => webpack.Configuration | void)
  | webpack.Configuration;

/**
 * @deprecated
 */
// TODO supported use function to config devServer
export type WebpackDevServerConfigCallback = (app: Application, server: webpackDevServer) => void;

export type CommandCallback<P extends Record<string | number, unknown>> = (
  args: ParsedArgs<P>,
  rawArgv: string[],
) => void;

export type CommandList<P extends Record<string | number, unknown>> = Record<
  builtinServiceCommandName,
  {
    commandCallback: CommandCallback<P>;
    opts: Record<string, unknown> | CommandCallback<P>;
  }
>;

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
