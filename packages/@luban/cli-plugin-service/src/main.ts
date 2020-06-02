import webpack = require("webpack");
import Config = require("webpack-chain");
import webpackDevServer = require("webpack-dev-server");
import { Request, Response, NextFunction } from "express";

type OptionsOfCssLoader = {
  css: Record<string, any>;
  less: Record<string, any>;
  postcss: Record<string, any>;
  miniCss: Record<string, any>;
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
   * @description 是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到文档中的内联样式代码)
   *
   * @default process.env.NODE_ENV === "production"
   */
  extract: boolean;

  /**
   * @description 是否为 CSS 开启 source map
   *
   * @default process.env.NODE_ENV === "development"
   */
  sourceMap: boolean;

  /**
   * @description 一些处理 css 的 loader 的配置项
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
  assetsDir: AssetsDir;

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
   * 如果这个值是一个对象，则会通过 `webpack-merge` 合并到最终的配置中
   * 如果这个值是一个函数，则会接收被解析的配置作为参数。该函数及可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本
   *
   * @type {Object | Function | undefined}
   *
   * @default {() => undefined}
   */
  configureWebpack:
    | webpack.Configuration
    | ((config: webpack.Configuration) => webpack.Configuration | void);

  /**
   * @description 是一个函数，会接收一个基于 `webpack-chain` 的 `Config` 实例
   * 允许对内部的 webpack 配置进行更细粒度的修改
   *
   * @default {() => undefined}
   */
  chainWebpack: (config: Config) => void;

  /**
   * @description 一些解析 css 的配置选项
   */
  css: CssConfig;

  /**
   * @description webpack-dev-server 的配置项
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
   * 约定根目录下 `mock/index.ts` 或者 `mock/index.js` 为默认 mock 配置文件
   */
  mock: boolean;
};

export function createProjectConfig(params: Partial<ProjectConfig>): Partial<ProjectConfig> {
  return params;
}

export type MockFunction = (req: Request, res: Response, next?: NextFunction) => void;
export type MockValue = string | { [key: string]: any } | MockFunction;

export type MockConfig = { [key: string]: MockValue };

export function createMockConfig(config: MockConfig): MockConfig {
  return config;
}
