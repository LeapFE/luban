import webpack = require("webpack");
// import Config = require("webpack-chain");
import webpackDevServer = require("webpack-dev-server");
import { Request, Response, NextFunction } from "express";
import { Parser, Stringifier, Syntax, Plugin } from "postcss/lib/postcss";
import "less";
import { WebpackConfigName } from "./definitions";

type CssLoaderOptions = {
  url: boolean | ((url: string, path: string) => boolean);
  import: boolean | ((url: string, media: string, path: string) => boolean);
  modules:
    | boolean
    | "global"
    | "local"
    | Partial<{
        mode: "global" | "local";
        localIdentName: string;
        context: string;
        hashPrefix: string;
      }>;
  sourceMap: boolean;
  importLoaders: number;
  localsConvention: string;
  onlyLocals: boolean;
  esModule: boolean;
};

type PostcssLoaderOptions = {
  exec: boolean;
  parser: boolean | Parser;
  syntax: boolean | Syntax;
  stringifier: Stringifier;
  config: {
    path?: string;
    context?: { env?: string; file?: { extname?: string; dirname?: string; basename?: string } };
    options: Record<string, unknown>;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: Plugin<any>[] | ((loader: webpack.loader.LoaderContext) => Plugin<any>[]);
  sourceMap: boolean | string;
};

type MiniCSSLoaderOptions = {
  publicPath: string | ((url: string, path: string) => string);
  hmr: boolean;
  reloadAll: boolean;
};

type OptionsOfCssLoader = {
  css: Partial<CssLoaderOptions>;
  less: Partial<Less.Options>;
  postcss: Partial<PostcssLoaderOptions>;
  miniCss: Partial<MiniCSSLoaderOptions>;
};

type AssetsDir = {
  scripts: string;
  styles: string;
  images: string;
  fonts: string;
  media: string;
};

type CssConfig = {
  /**
   * @description 是否为 CSS/Less 开启 source map
   *
   * @default process.env.NODE_ENV === "development"
   */
  sourceMap: boolean;

  /**
   * @description 一些处理 css 的 loader 的配置项
   * @deprecated since 2.0
   */
  loaderOptions: Partial<OptionsOfCssLoader>;
};

export type ProjectConfig = {
  /**
   * @description 应用部署时的基本 URL
   *
   * @default "/"
   */
  publicPath: string;

  /**
   * @description 生产环境下应用打包的目录
   *
   * @default "dist"
   */
  outputDir: string;

  /**
   * @description 放置生成的静态资源(js、css、img、fonts)的目录
   *
   * 默认脚本文件放在 `scripts` 目录下
   * 样式文件放在 `styles` 目录下
   * 图片放在 `images` 目录下
   * 字体文件放在 `fonts` 目录下
   * 媒体文件放在 `media` 目录下
   * 以上目录都是相对于 `outputDir`
   */
  assetsDir: Partial<AssetsDir>;

  /**
   * @description 指定生成的 index.html 文件名或者相对路径（路径是相对于 `outputDir` 的）
   * 默认路径为 `${outputDir}/index.html`
   *
   * @default "index.html"
   */
  indexPath: string;

  /**
   * @description 指定模板文件名称或者相对路径（路径是相对于 `template` 的）
   * 默认路径为 `template/index.html`
   *
   * @default "index.html"
   */
  templatePath: string;

  /**
   * @description 是否在生成环境下开启 sourceMap
   *
   * @default false
   */
  productionSourceMap: boolean;

  /**
   * @description webpack 配置
   * 这个值是一个函数，接收被解析的配置和配置名称作为参数。该函数可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本
   *
   * @type {Function | undefined}
   *
   * @default {() => undefined}
   */
  configureWebpack: (
    config: webpack.Configuration,
    id: WebpackConfigName,
  ) => webpack.Configuration | void;

  /**
   * @description 是一个函数，会接收一个基于 `webpack-chain` 的 `Config` 实例
   * 允许对内部的 webpack 配置进行更细粒度的修改
   *
   * @default {() => undefined}
   * TODO deprecated this options
   */
  // chainWebpack: (config: Config) => void;

  /**
   * @description 一些解析 css 的配置选项
   */
  css: Partial<CssConfig>;

  /**
   * @description webpack-dev-server 的配置项
   * @deprecated since 2.0
   */
  devServer: webpackDevServer.Configuration;

  /**
   * @description 图片等文件的最大 size
   * @default 4096
   */
  assetsLimit: number;

  /**
   * @description 项目路径映射别名
   */
  alias: Record<string, string>;

  /**
   * @description 是否开启本地 mock 服务
   * 约定根目录下`mock/index.js` 为默认 mock 配置文件
   */
  mock: boolean;

  /**
   * @description 是否开启 server side rendering
   */
  ssr: boolean;
};

export function createProjectConfig(params: Partial<ProjectConfig>): Partial<ProjectConfig> {
  return params;
}

export type MockFunction = (req: Request, res: Response, next?: NextFunction) => void;
export type MockValue = string | { [key: string]: unknown } | MockFunction;

export type MockConfig = { [key: string]: MockValue };
