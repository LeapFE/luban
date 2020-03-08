import { PluginAPI } from "./../lib/PluginAPI";
import { ProjectConfig, UrlLoaderOptions } from "./../definitions";
import Config from "webpack-chain";
import TerserWebpackPlugin from "terser-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { Options as TSImportPluginOptions } from "ts-import-plugin";
import { LoaderOptions as TSLoaderOptions } from "ts-loader/dist/interfaces";
import { UILibrary } from "@luban-cli/cli-shared-types/dist/shared";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsImportPluginFactory = require("ts-import-plugin");

import { getAssetsPath } from "./../utils/getAssetsPath";
import { resolveClientEnv } from "./../utils/resolveClientEnv";
import { terserOptions } from "./../utils/terserOptions";

/**
 * 设置 mode, entry, output, 其中 entry.app 的文件后缀区分 js 和 ts (读取 src/index.jsx 或者 src/index.tsx)
 *
 * 设置别名 文件扩展解析后缀集合
 *
 * 设置诸如 .jpg资源
 *
 * 通过 DefinePlugin 设置 全局环境变量并向客户端册注入 /^APP-/ 变量
 *
 * 使用 TerserPlugin 来 minify javascript 代码
 */

export default function(api: PluginAPI, options: Required<ProjectConfig>): void {
  const genAssetSubPath: (dir: string) => string = function(dir) {
    return getAssetsPath(options, `${dir}/[name].[hash:8].[ext]`);
  };

  const genUrlLoaderOptions: (dir: string) => UrlLoaderOptions = function(dir) {
    return {
      limit: options.assetsLimit,
      fallback: {
        loader: "file-loader",
        options: {
          name: genAssetSubPath(dir),
        },
      },
    };
  };

  const getTsLoaderOptions = (uiLibraries: UILibrary[]): Partial<TSLoaderOptions> => {
    const importPlugins: TSImportPluginOptions[] = [];

    if (uiLibraries.includes("ant-design")) {
      importPlugins.push({
        libraryName: "antd",
        libraryDirectory: "lib",
        style: "css",
      });
    }

    if (uiLibraries.includes("ant-design-mobile")) {
      importPlugins.push({
        libraryName: "antd-mobile",
        libraryDirectory: "lib",
        style: "css",
      });
    }

    return {
      transpileOnly: true,
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      getCustomTransformers: () => {
        return {
          before: [tsImportPluginFactory(importPlugins)],
        };
      },
    };
  };

  const isProduction = process.env.NODE_ENV === "production";

  const entryFileOfApp = api.getEntryFile();

  const isTSProject = api.resolveInitConfig().language === "ts";

  api.chainWebpack((webpackConfig: Config) => {
    webpackConfig
      .mode("development")
      .context(api.service.context)
      .entry("app")
      .add(`./src/${entryFileOfApp}`)
      .end()
      .output.path(api.resolve(options.outputDir))
      .filename("[name].js")
      .publicPath(options.publicPath);

    webpackConfig.resolve.extensions
      .merge([".js", ".jsx", ".ts", ".json", ".tsx"])
      .end()
      .modules.add("node_modules")
      .add(api.resolve("node_modules"))
      .end()
      .alias.set("@", api.resolve("src"))
      .end();

    if (options.alias) {
      Object.keys(options.alias).forEach((key) => {
        webpackConfig.resolve.alias.set(key, options.alias[key]);
      });
    }

    const jsRule = webpackConfig.module.rule("js");

    const tsRule = webpackConfig.module.rule("ts");

    const eslintRule = webpackConfig.module.rule("eslint");
    eslintRule
      .test(isTSProject ? /\.ts[x]?$/ : /\.jsx?$/)
      .enforce("pre")
      .exclude.add(/node_modules/)
      .end()
      .use("eslint-loader")
      .loader("eslint-loader")
      .end();

    /**
     * 生产环境下 使用 babel 来编译 ts 代码，并针对目标运行环境（浏览器）注入 polyfill 代码
     * 开发环境下 使用 ts-loader 来编译 ts 代码，但是不会注入 polyfill 代码
     */
    if (isTSProject && isProduction) {
      tsRule
        .test(/\.ts[x]?$/)
        .exclude.add(/node_modules/)
        .end()
        .use("babel-loader")
        .loader("babel-loader")
        .options({ cacheDirectory: true })
        .end();
    }

    if (isTSProject && !isProduction) {
      tsRule
        .test(/\.ts[x]?$/)
        .exclude.add(/node_modules/)
        .end()
        .use("ts-loader")
        .loader("ts-loader")
        .options(getTsLoaderOptions(api.resolveInitConfig().uiLibrary))
        .end();
    }

    /**
     * 生产和开发环境下对 js 代码都使用 babel 来转译代码，同时针对目标运行环境（浏览器）注入 polyfill 代码
     */
    if (!isTSProject) {
      jsRule
        .test(/\.jsx?$/)
        .include.add(api.resolve("src"))
        .end()
        .exclude.add(/node_modules/)
        .end()
        .use("babel-loader")
        .loader("babel-loader")
        .options({ cacheDirectory: true })
        .end();
    }

    webpackConfig.module
      .rule("images")
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .use("url-loader")
      .loader("url-loader")
      .options(genUrlLoaderOptions("img"));

    webpackConfig.module
      .rule("media")
      .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
      .use("url-loader")
      .loader("url-loader")
      .options(genUrlLoaderOptions("media"));

    webpackConfig.module
      .rule("fonts")
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
      .use("url-loader")
      .loader("url-loader")
      .options(genUrlLoaderOptions("fonts"));

    webpackConfig.node.merge({
      process: "mock",
      dgram: "empty",
      fs: "empty",
      net: "empty",
      tls: "empty",
      // eslint-disable-next-line @typescript-eslint/camelcase
      child_process: "empty",
    });

    webpackConfig
      .plugin("define")
      .use(require("webpack").DefinePlugin, [resolveClientEnv(options)]);
    webpackConfig.plugin("clean").use(CleanWebpackPlugin, [{ verbose: true }]);

    webpackConfig.optimization
      .minimizer("terser")
      .use(TerserWebpackPlugin, [terserOptions(options)]);
  });
}
