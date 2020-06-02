import HtmlWebpackPlugin, { Options as HtmlPluginOptions } from "html-webpack-plugin";
import { existsSync } from "fs";
import { error } from "@luban-cli/cli-shared-utils";
import CopyWebpackPlugin = require("copy-webpack-plugin");
import { pathExistsSync } from "fs-extra";

import { PluginAPI } from "./../lib/PluginAPI";
import { ProjectConfig } from "./../main";
import { resolveClientEnv } from "./../utils/resolveClientEnv";

export default function(api: PluginAPI, options: ProjectConfig): void {
  api.chainWebpack((webpackConfig) => {
    const isProduction = process.env.NODE_ENV === "production";

    const outputDir = api.resolve(options.outputDir);

    webpackConfig.output
      .path(outputDir)
      .filename("[name]-[hash:8].js")
      .end();

    const htmlPath =
      options.templatePath === "index.html"
        ? api.resolve("template/index.html")
        : api.resolve(`template/${options.templatePath}`);

    if (!existsSync(htmlPath)) {
      error(`The template html file ${htmlPath} not exit, please check it`);
      process.exit();
    }

    const htmlPluginOptions: HtmlPluginOptions = {
      template: htmlPath,
      templateParameters: resolveClientEnv(options.publicPath, true),
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

    webpackConfig.plugin("html").use(HtmlWebpackPlugin, [htmlPluginOptions]);

    const publicDir = api.resolve("public");
    if (pathExistsSync(publicDir)) {
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
                ignore: [".DS_Store", options.templatePath],
              },
            },
          ],
        },
      ]);
    }
  });
}
