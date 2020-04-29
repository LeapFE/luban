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
export type CommandCallback<P> = (args: ParsedArgs<P>, rawArgv: string[]) => void;
export type CommandList<P> = Record<
  builtinServiceCommandName,
  {
    commandCallback: CommandCallback<P>;
    opts: Record<string, any> | null | PluginApplyCallback;
  }
>;
export type DefaultProjectConfig = Partial<typeof defaultsProjectConfig>;

export type WebpackConfiguration = webpack.Configuration & { devServer?: WebpackDevServerConfig };

type OptionsOfCssLoader = {
  css: Record<string, any>;
  less: Record<string, any>;
  postcss: Record<string, any>;
  miniCss: Record<string, any>;
};

type CssConfig = {
  /**
   * @description 是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到文档中的内联样式代码)
   *
   * @default process.env.NODE_ENV === "production"
   */
  extract?: boolean;

  /**
   * @description 是否为 CSS 开启 source map
   *
   * @default process.env.NODE_ENV === "development"
   */
  sourceMap?: boolean;

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
   *
   * 默认脚本文件放在 `scripts` 目录下
   * 样式文件放在 `styles` 目录下
   * 图片放在 `images` 目录下
   * 字体文件放在 `fonts` 目录下
   * 媒体文件放在 `media` 目录下
   * 以上目录都是相对于 `outputDir`
   *
   * @default "dist"
   */
  outputDir?: string;

  /**
   * @description 放置生成的静态资源(js、css、img、fonts)的目录
   * @default ""
   */
  assetsDir: {
    scripts: string;
    styles: string;
    images: string;
    fonts: string;
    media: string;
  };

  /**
   * @description 指定生成的 index.html 文件名或者相对路径
   * @default "index.html"
   */
  indexPath: string;

  /**
   * @description 是否在生成环境下开启 sourceMap
   * @default false
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
