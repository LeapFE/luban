import url from "url";
import path from "path";
import webpack = require("webpack");
import Config = require("webpack-chain");
import { HotModuleReplacementPlugin } from "webpack";
import WebpackBar = require("webpackbar");
import portfinder from "portfinder";
import WebpackDevServer = require("webpack-dev-server");
import { Application } from "express";
import chalk from "chalk";
import { openBrowser, IpcMessenger, log, error, info } from "@luban-cli/cli-shared-utils";
import { existsSync } from "fs";

import { PluginAPI } from "./../lib/PluginAPI";
import { ServeCliArgs, ParsedArgs } from "./../definitions";
import { ProjectConfig } from "./../main";
import { prepareUrls } from "./../utils/prepareURLs";
import { setupMockServer } from "../utils/setupMockServer";

const defaultServerConfig = {
  host: "0.0.0.0",
  port: 8080,
  https: false,
};

function isAbsoluteUrl(url: string): boolean {
  // A URL is considered absolute if it begins with "<scheme>://" or "//"
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

function addDevClientToEntry(config: webpack.Configuration, devClient: string[]): void {
  const { entry } = config;

  // add devClient for every entry(entry is a map)
  if (typeof entry === "object" && !Array.isArray(entry)) {
    Object.keys(entry).forEach((key) => {
      entry[key] = devClient.concat(entry[key]);
    });
  } else if (Array.isArray(entry)) {
    config.entry = devClient.concat(entry);
  } else if (typeof entry === "string" || typeof entry === "function") {
    // entry maybe a function that return a Promise
    // see https://webpack.js.org/configuration/entry-context/#dynamic-entry
    config.entry = entry;
  }
}

export default function(api: PluginAPI, options: ProjectConfig): void {
  api.registerCommand(
    "serve",
    {
      description: "start development server",
      usage: "luban-cli-service serve [options]",
      options: {
        "--entry": "specify entry file",
        "--config": "specify config file",
        "--open": `open browser on server start`,
        "--mode": `specify env mode (default: development)`,
        "--host": `specify host (default: ${defaultServerConfig.host})`,
        "--port": `specify port (default: ${defaultServerConfig.port})`,
        "--https": `use https (default: ${defaultServerConfig.https})`,
        "--public": `specify the public network URL for the HMR client`,
      },
    },
    async (args: ParsedArgs<ServeCliArgs>) => {
      const isProduction = process.env.NODE_ENV === "production";

      const defaultEntryFile = api.getEntryFile();
      const entryFile = args.entry || `src/${defaultEntryFile}`;

      if (!existsSync(api.resolve(entryFile))) {
        error(`The entry file ${entryFile} not exit, please check it`);
        process.exit();
      }

      api.chainWebpack((webpackConfig: Config) => {
        if (!isProduction) {
          webpackConfig.mode("development").devtool("cheap-module-eval-source-map");

          webpackConfig.plugin("hmr").use(HotModuleReplacementPlugin);
          webpackConfig
            .plugin("webpack-bar")
            .use(WebpackBar, [
              { name: api.resolveInitConfig().projectName || "Client", color: "#41b883" },
            ]);
        }
      });

      const webpackConfig = api.resolveWebpackConfig();

      const projectDevServerOptions = Object.assign(
        webpackConfig.devServer || {},
        options.devServer,
      );

      webpackConfig.entry = {
        app: ["react-hot-loader/patch", api.resolve(entryFile)],
      };

      const useHttps = args.https || projectDevServerOptions.https || defaultServerConfig.https;
      const protocol = useHttps ? "https" : "http";
      const host =
        args.host ||
        process.env.DEV_SERVER_HOST ||
        projectDevServerOptions.host ||
        defaultServerConfig.host;

      const _port =
        args.port ||
        process.env.DEV_SERVER_PORT ||
        projectDevServerOptions.port ||
        defaultServerConfig.port;
      const port = await portfinder.getPortPromise({ port: Number(_port) });

      const rawPublicUrl = args.public || projectDevServerOptions.public;
      const publicUrl = rawPublicUrl
        ? /^[a-zA-Z]+:\/\//.test(rawPublicUrl)
          ? rawPublicUrl
          : `${protocol}://${rawPublicUrl}`
        : null;

      const urls = prepareUrls(
        protocol,
        host,
        port,
        isAbsoluteUrl(options.publicPath) ? "/" : options.publicPath,
      );
      const localUrlForBrowser = publicUrl || urls.localUrlForBrowser;

      // inject dev & hot-reload middleware entries
      if (!isProduction) {
        const sockjsUrl = publicUrl
          ? // explicitly configured via devServer.public
            `?${publicUrl}/sockjs-node`
          : `?` +
            url.format({
              protocol,
              port,
              hostname: urls.lanUrlForConfig || "localhost",
              pathname: "/sockjs-node",
            });
        const devClients = [
          // dev server client
          require.resolve("webpack-dev-server/client") + sockjsUrl,
          // hmr client
          require.resolve(
            projectDevServerOptions.hotOnly
              ? "webpack/hot/only-dev-server"
              : "webpack/hot/dev-server",
          ),
        ];
        // inject dev/hot client
        addDevClientToEntry(webpackConfig, devClients);
      }

      const compiler = webpack(webpackConfig);

      const webpackDevServerOptions: WebpackDevServer.Configuration = {
        clientLogLevel: "info",
        historyApiFallback: {
          disableDotRule: true,
          rewrites: [{ from: /./, to: path.posix.join(options.publicPath || "/", "index.html") }],
        },
        contentBase: api.resolve("public"),
        watchContentBase: !isProduction,
        hot: !isProduction,
        compress: isProduction,
        publicPath: options.publicPath,
        overlay: { warnings: false, errors: true },
        https: useHttps,
        open: false,
        stats: {
          version: true,
          timings: true,
          colors: true,
          modules: false,
          children: false,
        },

        ...projectDevServerOptions,

        before: (app: Application, server: WebpackDevServer) => {
          if (options.mock && api.service.mockConfig !== null) {
            info("setup development mock server...\n");
            setupMockServer(app, api.service.mockConfig);
          }

          // TODO supported use function to config devServer
          // api.service.webpackDevServerConfigCallback.forEach((callback) => callback(app, server));
          projectDevServerOptions.before && projectDevServerOptions.before(app, server, compiler);
        },
      };

      const server = new WebpackDevServer(compiler, webpackDevServerOptions);
      (["SIGINT", "SIGTERM"] as Array<NodeJS.Signals>).forEach((signal: NodeJS.Signals) => {
        process.on(signal, () => {
          server.close();
          process.exit();
        });
      });

      return new Promise<{ server: WebpackDevServer; url: string }>((resolve, reject) => {
        // log instructions & open browser on first compilation complete
        let isFirstCompile = true;
        compiler.hooks.done.tap("luban-cli-service serve", (stats) => {
          if (stats.hasErrors()) {
            stats.toJson().errors.forEach((err) => {
              log(err);
            });
            return;
          }

          const networkUrl = publicUrl
            ? publicUrl.replace(/([^/])$/, "$1/")
            : urls.lanUrlForTerminal;

          console.log();
          console.log(`  App running at:`);
          console.log(`  - Local:   ${chalk.cyan(urls.localUrlForTerminal)}`);
          console.log(`  - Network: ${chalk.cyan(networkUrl)}`);
          console.log();

          if (isFirstCompile) {
            isFirstCompile = false;

            if (options.mock && api.service.mockConfig !== null) {
              console.log("  Development mock server running at:");
              console.log(`  - Local:   ${chalk.cyan(urls.localUrlForTerminal)}`);
              console.log(`  - Network: ${chalk.cyan(networkUrl)}`);
              console.log();
            }

            const buildCommand = "npm run build";
            console.log(`  Note that the development build is not optimized.`);
            console.log(`  To create a production build, run ${chalk.cyan(buildCommand)}.`);
            console.log(`  To exit the server, use ${chalk.red("control + c")}`);

            console.log();

            if (args.open || projectDevServerOptions.open) {
              const pageUri =
                projectDevServerOptions.openPage &&
                typeof projectDevServerOptions.openPage === "string"
                  ? projectDevServerOptions.openPage
                  : "";
              openBrowser(localUrlForBrowser + pageUri);
            }

            // Send final app URL
            const ipc = new IpcMessenger();
            ipc.send({
              lubanServer: {
                url: localUrlForBrowser,
              },
            });

            // resolve returned Promise
            // so other commands can do api.service.run('serve').then(...)
            resolve({
              server,
              url: localUrlForBrowser,
            });
          }
        });

        server.listen(port, host, (err?: Error) => {
          if (err) {
            reject(err);
          }
        });
      });
    },
  );
}
