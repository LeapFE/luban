import path from "path";
import webpack from "webpack";
import WebpackBar from "webpackbar";
import webpackMerge from "webpack-merge";
import TerserWebpackPlugin from "terser-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
import FilterWarningsPlugin from "webpack-filter-warnings-plugin";

import { getBabelConfig } from "./getBabelConfig";
import { CleanUpStatsPlugin } from "./CleanUpStatsPlugin";

import { getProjectPath, injectRequire, getProjectPackageJson } from "./share";

injectRequire();

const pkg = getProjectPackageJson();

const svgRegex = /\.svg(\?v=\d+\.\d+\.\d+)?$/;
const svgOptions = {
  limit: 10000,
  minetype: "image/svg+xml",
};

const imageOptions = {
  limit: 10000,
};

function getWebpackConfig() {
  const babelConfig = getBabelConfig(false);

  // babel import for components
  babelConfig.plugins?.push([
    require.resolve("babel-plugin-import"),
    {
      style: true,
      libraryName: pkg.name,
      libraryDirectory: "components",
    },
  ]);

  const config: webpack.Configuration = {
    devtool: "source-map",

    output: {
      path: getProjectPath("./dist/"),
      filename: "[name].js",
    },

    resolve: {
      modules: ["node_modules", path.join(__dirname, "../node_modules")],
      extensions: [
        ".web.tsx",
        ".web.ts",
        ".web.jsx",
        ".web.js",
        ".ts",
        ".tsx",
        ".js",
        ".jsx",
        ".json",
      ],
      alias: {
        [pkg.name]: process.cwd(),
      },
    },

    node: [
      "child_process",
      "cluster",
      "dgram",
      "dns",
      "fs",
      "module",
      "net",
      "readline",
      "repl",
      "tls",
    ].reduce(
      (acc, name) => ({
        ...acc,
        [name]: "empty",
      }),
      {},
    ),

    module: {
      noParse: [/moment.js/],
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: require.resolve("babel-loader"),
          options: babelConfig,
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: require.resolve("babel-loader"),
              options: babelConfig,
            },
            {
              loader: require.resolve("ts-loader"),
              options: {
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: require.resolve("css-loader"),
              options: {
                sourceMap: true,
              },
            },
            {
              loader: require.resolve("postcss-loader"),
              options: {
                postcssOptions: {
                  plugins: ["autoprefixer"],
                },
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: require.resolve("css-loader"),
              options: {
                sourceMap: true,
              },
            },
            {
              loader: require.resolve("postcss-loader"),
              options: {
                postcssOptions: {
                  plugins: ["autoprefixer"],
                },
                sourceMap: true,
              },
            },
            {
              loader: require.resolve("less-loader"),
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
                sourceMap: true,
              },
            },
          ],
        },

        // Images
        {
          test: svgRegex,
          loader: require.resolve("url-loader"),
          options: svgOptions,
        },
        {
          test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
          loader: require.resolve("url-loader"),
          options: imageOptions,
        },
      ],
    },

    plugins: [
      new CaseSensitivePathsPlugin(),
      new WebpackBar({
        name: `🚚  ${pkg.name}`,
        color: "#2f54eb",
      }),
      new CleanUpStatsPlugin(),
      new FilterWarningsPlugin({
        // suppress conflicting order warnings from mini-css-extract-plugin.
        // ref: https://github.com/ant-design/ant-design/issues/14895
        // see https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250
        exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
      }),
    ],

    performance: {
      hints: false,
    },
  };

  const entry = ["./components/index"];

  // Common config
  config.externals = {
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react",
    },
    "react-dom": {
      root: "ReactDOM",
      commonjs2: "react-dom",
      commonjs: "react-dom",
      amd: "react-dom",
    },
  };

  if (config.output) {
    config.output.library = pkg.name;
    config.output.libraryTarget = "umd";
  }

  config.optimization = {
    minimize: true,
    minimizer: [new TerserWebpackPlugin()],
  };

  // Development
  const uncompressedConfig = webpackMerge({}, config, {
    entry: {
      [pkg.name]: entry,
    },
    mode: "development",
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css",
      }),
    ],
  });

  // Production
  const prodConfig = webpackMerge({}, config, {
    entry: {
      [`${pkg.name}.min`]: entry,
    },
    mode: "production",
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
      }),
    ],
    optimization: {
      minimize: true,
      minimizer: [new CssMinimizerPlugin({})],
    },
  });

  return [prodConfig, uncompressedConfig];
}

export { getWebpackConfig };
