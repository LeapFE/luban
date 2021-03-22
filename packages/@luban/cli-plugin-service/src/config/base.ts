import Config = require("webpack-chain");
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import DefinePlugin from "webpack/lib/DefinePlugin";

import { PluginAPI } from "./../lib/PluginAPI";
import { resolveClientEnv } from "./../utils/resolveClientEnv";
import { UrlLoaderOptions } from "./../definitions";
import { ProjectConfig } from "./../main";

export default function(api: PluginAPI, options: ProjectConfig): void {
  const genUrlLoaderOptions: (dir?: string) => UrlLoaderOptions = function(dir) {
    return {
      limit: options.assetsLimit,
      fallback: {
        loader: "file-loader",
        options: {
          publicPath: options.publicPath,
          name: `${dir}/[name].[hash:8].[ext]`,
          context: api.service.context,
        },
      },
    };
  };

  const isProduction = process.env.NODE_ENV === "production";

  const entryFileOfApp = api.getEntryFile();

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

    const aliasKeys = Object.keys(options.alias);
    if (aliasKeys.length > 0) {
      aliasKeys.forEach((key) => {
        webpackConfig.resolve.alias.set(key, options.alias[key]);
      });
    }

    const tsRule = webpackConfig.module.rule("ts");
    if (isProduction) {
      tsRule
        .test(/\.ts[x]?$/)
        .exclude.add(/node_modules/)
        .end()
        .use("babel-loader")
        .loader("babel-loader")
        .options({ cacheDirectory: true })
        .end();
    }

    if (!isProduction) {
      tsRule
        .test(/\.ts[x]?$/)
        .exclude.add(/node_modules/)
        .end()
        .use("ts-loader")
        .loader("ts-loader")
        .options({ transpileOnly: true })
        .end();
    }

    webpackConfig.module
      .rule("images")
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .use("url-loader")
      .loader("url-loader")
      .options(genUrlLoaderOptions(options.assetsDir.images));

    webpackConfig.module
      .rule("media")
      .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
      .use("url-loader")
      .loader("url-loader")
      .options(genUrlLoaderOptions(options.assetsDir.media));

    webpackConfig.module
      .rule("fonts")
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
      .use("url-loader")
      .loader("url-loader")
      .options(genUrlLoaderOptions(options.assetsDir.fonts));

    webpackConfig.node.merge({
      process: "mock",
      dgram: "empty",
      fs: "empty",
      net: "empty",
      tls: "empty",
      child_process: "empty",
    });

    webpackConfig.plugin("define").use(DefinePlugin, [resolveClientEnv(options.publicPath)]);

    webpackConfig.plugin("clean").use(CleanWebpackPlugin, [{ verbose: true }]);
  });
}
