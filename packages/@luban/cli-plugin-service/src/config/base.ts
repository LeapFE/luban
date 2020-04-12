import Config from "webpack-chain";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

import { PluginAPI } from "./../lib/PluginAPI";
import { resolveClientEnv } from "./../utils/resolveClientEnv";
import { ProjectConfig, UrlLoaderOptions } from "./../definitions";

export default function(api: PluginAPI, options: Required<ProjectConfig>): void {
  const genUrlLoaderOptions: (dir: string) => UrlLoaderOptions = function(dir) {
    return {
      limit: options.assetsLimit,
      fallback: {
        loader: "file-loader",
        options: {
          publicPath: "../",
          name: `${dir}/[name].[hash:8].[ext]`,
          context: api.service.context,
        },
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
        .options({ transpileOnly: true })
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
      .options(genUrlLoaderOptions("images"));

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
  });
}
