import { PluginAPI } from "./../lib/PluginAPI";
import { ProjectConfig } from "./../definitions";

import Config from "webpack-chain";

import MiniCssExtractPlugin from "mini-css-extract-plugin";

import { getAssetsPath } from "./../utils/getAssetsPath";

export default function(api: PluginAPI, options: ProjectConfig): void {
  api.chainWebpack((webpackConfig: Config) => {
    const isProduction = process.env.NODE_ENV === "production";

    const createConfig = api.resolveInitConfig();

    const {
      css: { extract = isProduction, sourceMap = !isProduction, loaderOptions },
    } = options;

    const filename = getAssetsPath(options, `css/[name]${isProduction ? ".[hash:8]" : ""}.css`);

    const chunkFilename = getAssetsPath(
      options,
      `css/[name]${isProduction ? ".[chunkhash:8]" : ""}.css`,
    );

    const extractOptions = {
      filename,
      chunkFilename,
    };

    const miniCssOptions = {
      ...loaderOptions.miniCss,
      hmr: !isProduction,
      reloadAll: !isProduction,
    };

    const cssLoaderOptions = {
      ...loaderOptions.css,
      sourceMap,
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
      .options({ ...cssLoaderOptions, importLoaders: 1 })
      .end()
      .use("postcss")
      .loader("postcss-loader")
      .options({ ...loaderOptions.postcss, sourceMap, ident: "postcss" })
      .end();

    if (createConfig.cssPreprocessor === "less") {
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
          ...cssLoaderOptions,
          sourceMap,
          importLoaders: 2,
          modules: {
            localIdentName: "[local]-[hash:base64:5]",
          },
        })
        .end()
        .use("postcss-loader")
        .loader("postcss-loader")
        .options({ ...loaderOptions.postcss, sourceMap, ident: "postcss" })
        .end()
        .use("less-loader")
        .loader("less-loader")
        .options({ ...loaderOptions.less, sourceMap, noIeCompat: true })
        .end();
    }

    if (extract) {
      webpackConfig.plugin("extract-css").use(MiniCssExtractPlugin, [extractOptions]);
    }

    // TODO optimize css assets use `optimize-css-assets-webpack-plugin`
  });
}
