import path from "path";
import webpack from "webpack";
import WebpackBar from "webpackbar";
import nodeExternals from "webpack-node-externals";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export function setServerConfig(
  mode: webpack.Configuration["mode"],
  publicPath: string,
  buildPath: string,
  srcPath: string,
): webpack.Configuration {
  const entry = path.join(srcPath, ".luban/server.entry.tsx");

  const plugins: webpack.Plugin[] = [
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    new MiniCssExtractPlugin({
      filename: mode === "development" ? "[name].css" : "[name]-[hash:8].chunk.css",
      chunkFilename: mode === "development" ? "[name].css" : "[name]-[hash:8].chunk.css",
    }),
    new WebpackBar({ name: "[Server]ssr-demo", color: "#41b883" }),
    new webpack.DefinePlugin({ __IS_BROWSER__: false }),
  ];

  if (mode === "development") {
    plugins.push(new ReactRefreshWebpackPlugin(), new webpack.HotModuleReplacementPlugin());
  }

  return {
    mode: mode || "development",
    target: "node",
    entry,
    output: {
      path: buildPath,
      filename: "server-bundle.js",
      libraryTarget: "commonjs2",
      library: "server-output",
      publicPath,
    },
    externals: [
      nodeExternals({
        allowlist: /\.(css|less|sass|scss)$/,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.ts[x]?$/,
          loader: require.resolve("babel-loader"),
          exclude: /node_modules/,
          options: {
            cacheDirectory: true,
          },
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: require.resolve("css-loader"),
              options: {
                importLoaders: 1,
                modules: {
                  mode: "global",
                  exportGlobals: true,
                  localIdentName: "[name]__[local]__[hash:base64:5]",
                },
              },
            },
            {
              loader: require.resolve("less-loader"),
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/,
          loader: require.resolve("url-loader"),
          options: {
            limit: 10000,
            fallback: "file-loader",
            publicPath,
            name: "images/[name].[hash:8].[ext]",
          },
        },
      ],
    },
    resolve: {
      alias: {
        "@": srcPath,
      },
      extensions: [".js", ".json", ".jsx", ".ts", ".tsx"],
    },
    node: {
      __dirname: true,
      __filename: true,
    },
    plugins,
    optimization: {
      splitChunks: false,
    },
  };
}
