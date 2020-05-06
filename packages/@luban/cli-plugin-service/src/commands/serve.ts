import url from "url";
import path from "path";
import { Configuration as WebpackConfig } from "webpack";
import Config from "webpack-chain";
import webpack, { HotModuleReplacementPlugin, ProgressPlugin } from "webpack";
import portfinder from "portfinder";
import WebpackDevServer, {
  Configuration as WebpackDevServerConfiguration,
} from "webpack-dev-server";
import { Application } from "express";
import chalk from "chalk";
import { openBrowser, IpcMessenger, log, error } from "@luban-cli/cli-shared-utils";
import { existsSync } from "fs";

import { PluginAPI } from "./../lib/PluginAPI";
import { ServeCliArgs, ProjectConfig, ParsedArgs } from "./../definitions";
import { prepareUrls } from "./../utils/prepareURLs";

const defaultServerConfig = {
  host: "0.0.0.0",
  port: 8080,
  https: false,
};

function isAbsoluteUrl(url: string): boolean {
  // A URL is considered absolute if it begins with "<scheme>://" or "//"
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

function addDevClientToEntry(config: WebpackConfig | Config, devClient: any): void {
  const { entry } = config;
  if (typeof entry === "object" && !Array.isArray(entry)) {
    Object.keys(entry).forEach((key) => {
      entry[key] = devClient.concat(entry[key]);
    });
  } else if (typeof entry === "function") {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    config.entry = entry(devClient);
  } else {
    config.entry = devClient.concat(entry);
  }
}

export default function(api: PluginAPI, options: Required<ProjectConfig>): void {
  api.registerCommand(
    "serve",
    {
      description: "start development server",
      usage: "luban-cli-service serve [options]",
      options: {
        "--entry": "specify entry file",
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
          webpackConfig.plugin("progress").use(ProgressPlugin);
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

      const webpackDevServerOptions: WebpackDevServerConfiguration = {
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
        before: (app: Application, server: WebpackDevServer) => {
          api.service.webpackDevServerConfigCallback.forEach((callback) => callback(app, server));
          projectDevServerOptions.before && projectDevServerOptions.before(app, server, compiler);
        },
        open: false,
        stats: {
          version: true,
          timings: true,
          colors: true,
          modules: false,
          children: false,
        },
        ...projectDevServerOptions,
      };

      // create server
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

            const buildCommand = "npm run build";
            console.log(`  Note that the development build is not optimized.`);
            console.log(`  To create a production build, run ${chalk.cyan(buildCommand)}.`);
            console.log(`  To exit the server, use ${chalk.red("control + z")}`);

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
