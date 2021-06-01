import MiniCssExtractPlugin from "mini-css-extract-plugin";

import {
  ConfigPluginInstance,
  ConfigPluginApplyCallbackArgs,
  UrlLoaderOptions,
  WebpackConfigName,
} from "../definitions";
import { cleanAssetPath } from "../utils/cleanAssetPath";
import { CssLoaderOptions, LessLoaderOptions } from "../main";

class Module implements ConfigPluginInstance {
  apply(args: ConfigPluginApplyCallbackArgs) {
    const isDevelopment = process.env.NODE_ENV !== "production";
    const { api, projectConfig } = args;
    const {
      css: { sourceMap, loaderOptions },
    } = projectConfig;

    const cssLoaderOptions: CssLoaderOptions = {
      importLoaders: 1,
      sourceMap,
      ...(loaderOptions?.css || {}),
    };
    const lessLoaderOptions: LessLoaderOptions = {
      sourceMap,
      javascriptEnabled: true,
      ...(loaderOptions?.less || {}),
    };

    const genUrlLoaderOptions: (dir?: string) => UrlLoaderOptions = function(dir) {
      return {
        limit: projectConfig.assetsLimit,
        fallback: {
          loader: "file-loader",
          options: {
            publicPath: projectConfig.publicPath,
            name: cleanAssetPath(`${dir}/[name].[hash:8].[ext]`),
            context: api.getContext(),
          },
        },
      };
    };

    const getMiniCssOptions = (configId: WebpackConfigName) => {
      return {
        ...(loaderOptions?.miniCss || {}),
        emit: configId === "client",
      };
    };

    api.chainWebpack("server", (webpackConfig) => {
      webpackConfig.module
        .rule("ts")
        .test(/\.ts[x]?$/)
        .exclude.add(/node_modules/)
        .end()
        .use("babel-loader")
        .loader("babel-loader")
        .options({
          cacheDirectory: true,
          presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
          plugins: [isDevelopment && require.resolve("react-refresh/babel")].filter(Boolean),
        })
        .end();
    });

    api.chainWebpack("client", (webpackConfig) => {
      webpackConfig.module
        .rule("ts")
        .test(/\.ts[x]?$/)
        .exclude.add(/node_modules/)
        .end()
        .use("babel-loader")
        .loader("babel-loader")
        .options({ cacheDirectory: true, configFile: api.resolve("babel.config.js") })
        .end();
    });

    api.chainAllWebpack((webpackConfig, id) => {
      webpackConfig.module
        .rule("images")
        .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
        .use("url-loader")
        .loader("url-loader")
        .options(genUrlLoaderOptions(projectConfig.assetsDir.images));

      webpackConfig.module
        .rule("media")
        .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
        .use("url-loader")
        .loader("url-loader")
        .options(genUrlLoaderOptions(projectConfig.assetsDir.media));

      webpackConfig.module
        .rule("fonts")
        .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
        .use("url-loader")
        .loader("url-loader")
        .options(genUrlLoaderOptions(projectConfig.assetsDir.fonts));

      webpackConfig.module
        .rule("ejs")
        .test(/\.ejs$/)
        .use("ejs-compiled-loader")
        .loader("ejs-compiled-loader")
        .options({
          htmlmin: true,
          htmlminOptions: {
            removeComments: true,
          },
        })
        .end();

      webpackConfig.module
        .rule("css")
        .test(/\.css$/)
        .use("extract-css")
        .loader(MiniCssExtractPlugin.loader)
        .options(getMiniCssOptions(id))
        .end()
        .use("css-loader")
        .loader("css-loader")
        .options(cssLoaderOptions)
        .end()
        .use("postcss")
        .loader("postcss-loader")
        .options({ sourceMap })
        .end();

      webpackConfig.module
        .rule("less")
        .test(/\.less$/)
        .use("extract-css")
        .loader(MiniCssExtractPlugin.loader)
        .options(getMiniCssOptions(id))
        .end()
        .use("css-loader")
        .loader("css-loader")
        .options({
          modules: {
            mode: "global",
            exportGlobals: true,
            localIdentName: "[name]_[local]_[hash:base64:5]",
            context: api.getContext(),
          },
          ...cssLoaderOptions,
        })
        .end()
        .use("postcss-loader")
        .loader("postcss-loader")
        .options({ sourceMap })
        .end()
        .use("less-loader")
        .loader("less-loader")
        .options(lessLoaderOptions)
        .end();
    });
  }
}

export default Module;
