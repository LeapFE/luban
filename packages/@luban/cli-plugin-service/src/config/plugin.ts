import { CleanWebpackPlugin } from "clean-webpack-plugin";
import DefinePlugin from "webpack/lib/DefinePlugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin, { Options as HtmlPluginOptions } from "html-webpack-plugin";
import fs from "fs-extra";
import path from "path";
import { error } from "@luban-cli/cli-shared-utils";
import CopyWebpackPlugin = require("copy-webpack-plugin");
import { WebpackManifestPlugin } from "webpack-manifest-plugin";
import { HotModuleReplacementPlugin } from "webpack";
import WebpackBar = require("webpackbar");
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import PreloadWebpackPlugin = require("preload-webpack-plugin");
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

import { resolveClientEnv } from "../utils/resolveClientEnv";
import { MovePlugin } from "./../utils/movePlugin";

import {
  ConfigPluginInstance,
  ConfigPluginApplyCallbackArgs,
  BuildCliArgs,
  ParsedArgs,
} from "../definitions";

class Plugin implements ConfigPluginInstance {
  apply(params: ConfigPluginApplyCallbackArgs) {
    const { api, projectConfig, options, args } = params;

    const isProduction = process.env.NODE_ENV === "production";

    const filename = `${projectConfig.assetsDir.styles}/[name]${
      isProduction ? ".[hash:8]" : ""
    }.css`;

    const chunkFilename = `${projectConfig.assetsDir.styles}/[name]${
      isProduction ? ".[hash:8]" : ""
    }.css`;

    const extractOptions = {
      filename,
      chunkFilename,
    };

    const outputDir = api.resolve(projectConfig.outputDir);

    api.chainWebpack("client", (webpackConfig) => {
      webpackConfig
        .plugin("define")
        .use(DefinePlugin, [
          { ...resolveClientEnv(projectConfig.publicPath), __IS_BROWSER__: true },
        ]);

      const htmlPath =
        projectConfig.templatePath === "index.html"
          ? api.resolve("template/index.html")
          : api.resolve(`template/${projectConfig.templatePath}`);

      if (!fs.pathExistsSync(htmlPath)) {
        error(`The template html file ${htmlPath} not exit, please check it`);
        process.exit();
      }

      const htmlPluginOptions: HtmlPluginOptions = {
        template: htmlPath,
        templateParameters: resolveClientEnv(projectConfig.publicPath, true),
        minify: isProduction
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            }
          : false,
      };

      webpackConfig.plugin("client-html").use(HtmlWebpackPlugin, [htmlPluginOptions]);

      webpackConfig.plugin("server-html").use(HtmlWebpackPlugin, [
        {
          filename: "server.ejs",
          template: path.resolve(__dirname, "../template/dynamic/server.template.ejs"),
        },
      ]);

      const publicDir = api.resolve("public");
      if (fs.pathExistsSync(publicDir)) {
        webpackConfig.plugin("copy").use(CopyWebpackPlugin, [
          {
            patterns: [
              {
                from: publicDir,
                to: outputDir,
                toType: "dir",
                globOptions: {
                  dot: true,
                  gitignore: true,
                  ignore: [".DS_Store", projectConfig.templatePath],
                },
              },
            ],
          },
        ]);
      }

      webpackConfig
        .plugin("manifest")
        .use(WebpackManifestPlugin, [
          { fileName: "asset-manifest.json", publicPath: projectConfig.publicPath },
        ]);

      webpackConfig
        .plugin("webpack-bar")
        .use(WebpackBar, [{ name: `[Client] ${options.projectName}`, color: "#41b883" }]);

      if (isProduction) {
        if (projectConfig.indexPath !== "index.html") {
          webpackConfig
            .plugin("move")
            .use(MovePlugin, [
              path.resolve(`${outputDir}/index.html`),
              path.resolve(`${outputDir}/${projectConfig.indexPath}`),
            ]);
        }
      }

      if (isProduction) {
        webpackConfig.plugin("preload").use(PreloadWebpackPlugin, [
          {
            rel: "preload",
            include: "initial",
            fileBlacklist: [/map.js$/],
          },
        ]);

        webpackConfig.plugin("prefetch").use(PreloadWebpackPlugin, [
          {
            rel: "prefetch",
            include: "asyncChunks",
          },
        ]);
      }

      if (isProduction) {
        if ((args as ParsedArgs<BuildCliArgs>).report) {
          if (Array.isArray(webpackConfig.plugins)) {
            webpackConfig.plugins.push(
              new BundleAnalyzerPlugin({
                logLevel: "error",
                openAnalyzer: false,
                analyzerMode: (args as ParsedArgs<BuildCliArgs>).report ? "static" : "disabled",
                reportFilename: "report.html",
              }),
            );
          }
        }
      }
    });

    api.chainWebpack("server", (webpackConfig) => {
      webpackConfig
        .plugin("define")
        .use(DefinePlugin, [
          { ...resolveClientEnv(projectConfig.publicPath), __IS_BROWSER__: false },
        ]);

      webpackConfig
        .plugin("webpack-bar")
        .use(WebpackBar, [{ name: `[Server] ${options.projectName}`, color: "#41b883" }]);
    });

    api.chainAllWebpack((webpackConfig) => {
      webpackConfig
        .plugin("clean")
        .use(CleanWebpackPlugin, [{ verbose: true }])
        .end();

      webpackConfig
        .plugin("extract-css")
        .use(MiniCssExtractPlugin, [extractOptions])
        .end();

      if (!isProduction) {
        webpackConfig.plugin("hmr").use(HotModuleReplacementPlugin);
        webpackConfig.plugin("refresh").use(ReactRefreshWebpackPlugin);
      }
    });
  }
}

export default Plugin;
