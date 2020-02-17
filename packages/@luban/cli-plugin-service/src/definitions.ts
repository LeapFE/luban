import Config from "webpack-chain";
import webpack from "webpack";
import webpackDevServer, { Configuration as WebpackDevServerConfig } from "webpack-dev-server";
import { Application } from "express";

import { PluginAPI } from "./lib/PluginAPI";

import { defaultsProjectConfig } from "./lib/options";


export type RootOptions = { projectName?: string; preset?: Preset };

export type RawPlugin = {
  "@luban/cli-plugin-babel"?: Record<string, any>;
  "@luban/cli-plugin-typescript"?: Record<string, any>;
  "@luban/cli-plugin-eslint"?: Record<string, any>;
  "@luban/cli-plugin-stylelint"?: Record<string, any>;
  "@luban/cli-plugin-router"?: Record<string, any>;
  "@luban/cli-plugin-store"?: Record<string, any>;
  "@luban/cli-plugin-unit-test"?: Record<string, any>;
  "@luban/cli-plugin-service": RootOptions;
};

/**
 * @description package.json fields, name and version must required
 *
 * @see https://docs.npmjs.com/creating-a-package-json-file
 */
export type BasePkgFields = {
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

export type PluginApplyCallback = (api: PluginAPI, options: Record<string, any>) => void;
export type InlinePlugin = {
  id: string;
  apply: PluginApplyCallback;
};
export type ServicePlugin = InlinePlugin;
export type WebpackChainCallback = (config: Config) => void;
export type WebpackRawConfigCallback =
  | ((config: webpack.Configuration) => webpack.Configuration | undefined)
  | webpack.Configuration;
export type WebpackDevServerConfigCallback = (app: Application, server: webpackDevServer) => void;
export type CommandFn<P> = (args: ParsedArgs<P>, rawArgv: string[]) => void;
export type CommandList<P> = Record<
  string,
  {
    fn: CommandFn<P>;
    opts: Record<string, any> | null | PluginApplyCallback;
  }
>;
export type DefaultProjectConfig = Partial<typeof defaultsProjectConfig>;

export type WebpackConfiguration = webpack.Configuration;

type OptionsOfCssLoader = {
  css: Record<string, any>;
  less: Record<string, any>;
  postcss: Record<string, any>;
  miniCss: Record<string, any>;
};

type CssConfig = {
  /**
   * @description 是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)
   * process.env.NODE_ENV === "production"
   *
   * @default false
   */
  extract: boolean;

  /**
   * @description 是否为 CSS 开启 source map
   */
  sourceMap: boolean;

  /**
   * @description 一些处理 css 的 loader 的配置项
   */
  loaderOptions: OptionsOfCssLoader;
};

export type ProjectConfig = {
  /**
   * @description 应用部署时的基本 URL
   * @default "/"
   */
  publicPath: string;

  /**
   * @description 生产环境下应用打包的目录
   */
  outputDir?: string;

  /**
   * @description 放置生成的静态资源(js、css、img、fonts)的目录
   * @default ""
   */
  assetsDir: string;

  /**
   * @description 指定生成的 index.html 文件名或者相对路径
   * @default "index.html"
   */
  indexPath: string;

  /**
   * @description 是否在生成环境下开启 sourceMap
   * @default true
   */
  productionSourceMap: boolean;

  /**
   * @description webpack 配置
   * 如果这个值是一个对象，则会通过 `webpack-merge` 合并到最终的配置中
   * 如果这个值是一个函数，则会接收被解析的配置作为参数。该函数及可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本
   *
   * @type {Object | Function | undefined}
   */
  configureWebpack?:
    | WebpackConfiguration
    | ((config: WebpackConfiguration) => WebpackConfiguration);

  /**
   * @description 是一个函数，会接收一个基于 `webpack-chain` 的 `Config` 实例
   * 允许对内部的 webpack 配置进行更细粒度的修改
   */
  chainWebpack?: (config: Config) => void;

  /**
   * @description 一些解析 css 的配置选项
   */
  css: CssConfig;

  /**
   * @description webpack-dev-server 的配置项
   */
  devServer: WebpackDevServerConfig;

  /**
   * @description 图片等文件的最大 size
   * @default 4096
   */
  assetsLimit: number;

  /**
   * @description 项目路径映射别名
   */
  alias: Record<string, string>;
};

export type ServeCliArgs = Partial<{
  entry: string;
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
  mode: string;
  dest: string;
  report: boolean;
  help: boolean;
}>;

export type InspectCliArgs = Partial<{
  mode: string;
  rule: string;
  plugin: string;
  rules: string[];
  plugins: string[];
  verbose: boolean;
  help: boolean;
}>;

export type Preset = {
  useConfigFiles: boolean;
  cssPreprocessor?: "less" | "styled-components";
  plugins: RawPlugin;
  configs?: Record<string, string>;
};

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
