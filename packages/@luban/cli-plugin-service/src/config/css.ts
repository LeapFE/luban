import Config = require("webpack-chain");
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import { PluginAPI } from "./../lib/PluginAPI";
import { ProjectConfig } from "./../main";

export default function(api: PluginAPI, options: ProjectConfig): void {
  api.chainWebpack((webpackConfig: Config) => {
    const isProduction = process.env.NODE_ENV === "production";

    const createConfig = api.resolveInitConfig();

    const {
      css: { extract, sourceMap, loaderOptions = {} },
    } = options;

    const filename = `${options.assetsDir.styles}/[name]${isProduction ? ".[hash:8]" : ""}.css`;

    const chunkFilename = `${options.assetsDir.styles}/[name]${
      isProduction ? ".[chunkhash:8]" : ""
    }.css`;

    const extractOptions = {
      filename,
      chunkFilename,
    };

    const miniCssOptions = {
      hmr: !isProduction,
      reloadAll: !isProduction,
      ...loaderOptions.miniCss,
    };

    const cssLoaderOptions = {
      sourceMap,
      ...loaderOptions.css,
    };

    const cssRule = webpackConfig.module.rule("css");

    cssRule.test(/\.css$/).end();

    if (extract) {
      cssRule
        .use("extract-css")
        .loader(MiniCssExtractPlugin.loader)
        .options(miniCssOptions)
        .end();
    } else {
      cssRule
        .use("style-loader")
        .loader("style-loader")
        .end();
    }

    cssRule
      .use("css-loader")
      .loader("css-loader")
      .options({ importLoaders: 1, ...cssLoaderOptions })
      .end()
      .use("postcss")
      .loader("postcss-loader")
      .options({ sourceMap, ident: "postcss", ...loaderOptions.postcss })
      .end();

    if (createConfig.cssSolution === "less") {
      const lessRule = webpackConfig.module.rule("less");

      lessRule.test(/\.less$/).end();

      if (extract) {
        lessRule
          .use("extract-css")
          .loader(MiniCssExtractPlugin.loader)
          .options(miniCssOptions)
          .end();
      } else {
        lessRule
          .use("style-loader")
          .loader("style-loader")
          .end();
      }

      lessRule
        .use("css-loader")
        .loader("css-loader")
        .options({
          importLoaders: 1,
          modules: {
            mode: "global",
            exportGlobals: true,
            localIdentName: "[name]__[local]__[hash:base64:5]",
            context: api.service.context,
          },
          ...cssLoaderOptions,
        })
        .end()
        .use("postcss-loader")
        .loader("postcss-loader")
        .options({ sourceMap, ident: "postcss", ...loaderOptions.postcss })
        .end()
        .use("less-loader")
        .loader("less-loader")
        .options({ sourceMap, noIeCompat: true, ...loaderOptions.less })
        .end();
    }

    if (extract) {
      webpackConfig.plugin("extract-css").use(MiniCssExtractPlugin, [extractOptions]);
    }
  });
}
