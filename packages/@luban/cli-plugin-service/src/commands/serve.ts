import path from "path";
import webpack = require("webpack");
import portfinder from "portfinder";
import WebpackDevServer = require("webpack-dev-server");
import { Application } from "express";
import chalk from "chalk";
import { openBrowser, log, error, info } from "@luban-cli/cli-shared-utils";
import { pathExistsSync } from "fs-extra";
import http from "http";
import express from "express";
import Loadable from "react-loadable";
import MemoryFS from "memory-fs";
import { createProxyMiddleware } from "http-proxy-middleware";
import BodyParser from "body-parser";
import { StaticRouterContext } from "react-router";
import ReactDOMServer from "react-dom/server";
import ejs from "ejs";
import Helmet from "react-helmet";
import serialize from "serialize-javascript";

import { CommandPluginAPI } from "../lib/PluginAPI";
import {
  ServeCliArgs,
  ParsedArgs,
  ServerBundle,
  CommandPluginInstance,
  CommandPluginApplyCallbackArgs,
  CommandPluginAddWebpackConfigCallbackArgs,
} from "../definitions";
import { ProjectConfig } from "../main";
import { prepareUrls, UrlList } from "../utils/prepareURLs";
import { setupMockServer } from "../utils/setupMockServer";
import { produceBoilerplate, produceRoutesAndStore } from "../lib/produce";
import {
  delay,
  getModuleFromString,
  getTemplate,
  generateInjectedTag,
} from "../utils/serverRender";
import { cleanDest } from "../utils/clean";

const DEFAULT_HOST = "0.0.0.0";

const defaultClientServerConfig = {
  host: DEFAULT_HOST,
  port: 8080,
  https: false,
};

const defaultSSRServerConfig = {
  host: DEFAULT_HOST,
  port: 3000,
  https: false,
};

class Serve {
  private pluginApi: CommandPluginAPI;
  private projectConfig: ProjectConfig;
  private commandArgs: ParsedArgs<ServeCliArgs>;

  private CSRUrlList: UrlList | null;
  private SSRUrlList: UrlList | null;
  private csrServer: WebpackDevServer | null;
  private ssrServer: http.Server | null;

  private clientSideHost: string;
  private clientSidePort: number;

  private serverSideHost: string;
  private serverSidePort: number;

  private publicUrl: string | null;

  private protocol: "https" | "http";

  private clientSideServerOptions: WebpackDevServer.Configuration;

  private clientSideWebpackConfig: webpack.Configuration | undefined;
  private serverSideWebpackConfig: webpack.Configuration | undefined;

  constructor(api: CommandPluginAPI, projectConfig: ProjectConfig, args: ParsedArgs<ServeCliArgs>) {
    this.pluginApi = api;
    this.projectConfig = projectConfig;
    this.commandArgs = args;

    this.clientSideWebpackConfig = api.resolveWebpackConfig("client");

    this.serverSideWebpackConfig = api.resolveWebpackConfig("server");

    this.clientSideServerOptions = Object.assign(
      this.clientSideWebpackConfig?.devServer || {},
      projectConfig.devServer,
    );

    const useHttps =
      args.https || this.clientSideServerOptions.https || defaultClientServerConfig.https;
    this.protocol = useHttps ? "https" : "http";
  }

  private async init() {
    this.clientSideHost =
      this.commandArgs.host || this.clientSideServerOptions.host || defaultClientServerConfig.host;

    const clientSidePort =
      this.commandArgs.port || this.clientSideServerOptions.port || defaultClientServerConfig.port;

    this.serverSideHost = this.clientSideHost;
    const serverSidePort = defaultSSRServerConfig.port;

    this.clientSidePort = await portfinder.getPortPromise({ port: Number(clientSidePort) });
    this.serverSidePort = await portfinder.getPortPromise({ port: Number(serverSidePort) });

    const rawPublicUrl = this.commandArgs.public || this.clientSideServerOptions.public;
    this.publicUrl = rawPublicUrl
      ? /^[a-zA-Z]+:\/\//.test(rawPublicUrl)
        ? rawPublicUrl
        : `${this.protocol}://${rawPublicUrl}`
      : null;

    this.CSRUrlList = prepareUrls(this.protocol, this.clientSideHost, this.clientSidePort);

    this.SSRUrlList = prepareUrls(this.protocol, this.serverSideHost, this.serverSidePort);
  }

  private async startClientSide() {
    if (!this.clientSideWebpackConfig) {
      throw new Error("client side webpack config unable resolved; command [serve]");
    }

    const compiler = webpack(this.clientSideWebpackConfig);

    const webpackDevServerOptions: WebpackDevServer.Configuration = {
      clientLogLevel: "info",
      historyApiFallback: {
        disableDotRule: true,
        rewrites: [
          { from: /./, to: path.posix.join(this.projectConfig.publicPath || "/", "index.html") },
        ],
      },
      contentBase: this.pluginApi.resolve("public"),
      watchContentBase: true,
      hot: true,
      compress: true,
      publicPath: this.projectConfig.publicPath,
      overlay: { warnings: false, errors: true },
      https: this.protocol === "https",
      open: false,
      stats: {
        version: true,
        timings: true,
        colors: true,
        modules: false,
        children: false,
      },

      ...this.clientSideServerOptions,

      before: (app: Application) => {
        if (this.projectConfig.mock && this.pluginApi.service.mockConfig !== null) {
          info("setup development mock server...\n");
          setupMockServer(app, this.pluginApi.service.mockConfig || {});
        }
      },
    };

    this.csrServer = new WebpackDevServer(compiler, webpackDevServerOptions);

    return new Promise<void>((resolve, reject) => {
      let isFirstCompile = true;
      compiler.hooks.done.tap("done", (stats) => {
        if (stats.hasErrors()) {
          stats.toJson().errors.forEach((err) => {
            log(err);
          });
          return;
        }

        const networkUrl = this.publicUrl
          ? this.publicUrl.replace(/([^/])$/, "$1/")
          : this.CSRUrlList?.lanUrlForTerminal || "";

        if (isFirstCompile) {
          isFirstCompile = false;

          console.log();
          console.log(`  App running at:`);
          console.log(`  - Local:   ${chalk.cyan(this.CSRUrlList?.localUrlForTerminal || "")}`);
          console.log(`  - Network: ${chalk.cyan(networkUrl)}`);
          console.log();

          if (this.projectConfig.mock && this.pluginApi.service.mockConfig !== null) {
            console.log("  Development mock server running at:");
            console.log(`  - Local:   ${chalk.cyan(this.CSRUrlList?.localUrlForTerminal || "")}`);
            console.log(`  - Network: ${chalk.cyan(networkUrl)}`);
            console.log();
          }

          const buildCommand = "npm run build";
          console.log(`  Note that the development build is not optimized.`);
          console.log(`  To create a production build, run ${chalk.cyan(buildCommand)}.`);
          console.log(`  To exit the server, use ${chalk.red("control + c")}`);

          console.log();

          resolve();
        }
      });

      this.csrServer?.listen(this.clientSidePort, this.clientSideHost, (err?: Error) => {
        if (err) {
          reject(err);
        }
      });
    });
  }

  private startServerSide() {
    if (!this.serverSideWebpackConfig) {
      throw new Error("server side webpack config unable resolved; command [server]");
    }

    const mfs = new MemoryFS();

    const server = express();

    const compiler = webpack(this.serverSideWebpackConfig);

    compiler.outputFileSystem = mfs;

    let serverBundle: ServerBundle = { default: () => null, createStore: () => null };

    const watchCallback = (error: Error, stats: webpack.Stats) => {
      // never throw this error, just type narrow
      if (!this.serverSideWebpackConfig) {
        throw new Error("server side webpack config unable resolved; command [server]");
      }

      if (error) {
        throw error;
      }

      const info = stats.toJson();
      info.errors.forEach((error) => console.error(error));
      info.warnings.forEach((warn) => console.warn(warn));

      let bundlePath = "";
      if (this.serverSideWebpackConfig.output) {
        if (typeof this.serverSideWebpackConfig.output.filename === "string") {
          bundlePath = path.join(
            this.serverSideWebpackConfig.output.path || "",
            this.serverSideWebpackConfig.output.filename,
          );
        }
      }

      const bundle = mfs.readFileSync(bundlePath, "utf-8");

      const m = getModuleFromString(bundle, "server-entry.js");

      serverBundle = m.exports;
    };

    compiler.watch({}, watchCallback);

    // logger
    // TODO configure it open or close
    server.use((request, _, next) => {
      info(
        `${new Date().toLocaleTimeString()} ${request.method} ${request.originalUrl}`,
        "Server Side rendering",
      );

      next();
    });

    server.use(BodyParser.json());
    server.use(BodyParser.urlencoded({ extended: false }));

    const assetsProxy = createProxyMiddleware({
      ws: true,
      target: this.CSRUrlList?.localUrlForBrowser,
      logLevel: "silent",
    });

    server.use(this.projectConfig.publicPath, assetsProxy);

    // TODO handle /favicon.ico

    server.use(async (req, res, next) => {
      if (!serverBundle) {
        res.send("waiting for server side building...");
        return;
      }

      try {
        const templateUrl =
          this.CSRUrlList?.localUrlForBrowser + this.projectConfig.publicPath + "server.ejs";
        const assetsManifestJsonUrl =
          this.CSRUrlList?.localUrlForBrowser +
          this.projectConfig.publicPath +
          "asset-manifest.json";

        const template = await getTemplate(templateUrl.replace(/(\d+)[(^/)](\/)+/, "$1$2"));
        const assetsManifestJson = await getTemplate(
          assetsManifestJsonUrl.replace(/(\d+)[(^/)](\/)+/, "$1$2"),
        );

        const context = { path: req.path, initProps: {}, initState: {} };
        const staticRouterContext: StaticRouterContext = {};

        const store =
          typeof serverBundle.createStore === "function" ? serverBundle.createStore() : null;

        const App = await serverBundle.default(context, staticRouterContext, store);

        const { injectedScripts, injectedStyles } = generateInjectedTag(
          JSON.parse(assetsManifestJson),
          req.path,
        );

        let document = "";
        if (App) {
          const content = ReactDOMServer.renderToString(App);

          const helmet = Helmet.renderStatic();

          document = ejs.render(template, {
            CONTENT: content,
            __INITIAL_DATA__: serialize(context.initProps),
            __USE_SSR__: true,
            __INITIAL_STATE__: serialize(context.initState),
            INJECTED_STYLES: injectedStyles,
            INJECTED_SCRIPTS: injectedScripts,
            link: helmet.link.toString(),
            meta: helmet.meta.toString(),
            script: helmet.script.toString(),
            style: helmet.style.toString(),
            title: helmet.title.toString(),
          });
        }

        if (staticRouterContext.url) {
          res.status(302);
          res.setHeader("Location", staticRouterContext.url);
          res.end();
          return;
        }

        res.send(document);
      } catch (err) {
        next(err);
      }
    });

    server.use([
      function(err, _, res, _next) {
        console.log(err.stack);
        error("Something broke!", "Server Side rendering");

        res.status(500);
      },
    ]);

    return new Promise<void>((resolve, reject) => {
      let isFirstSSRCompile = true;
      compiler.hooks.done.tap("done", (stats) => {
        if (stats.hasErrors()) {
          stats.toJson().errors.forEach((err) => {
            log(err);
          });
          return;
        }

        if (isFirstSSRCompile) {
          isFirstSSRCompile = false;

          console.log();
          console.log(`  Server Side Rendering running at:`);
          console.log(`  - Local:   ${chalk.cyan(this.SSRUrlList?.localUrlForTerminal || "")}`);
          console.log(`  - Network: ${chalk.cyan(this.SSRUrlList?.lanUrlForTerminal || "")}`);
          console.log();

          resolve();
        }
      });

      Loadable.preloadAll().then(() => {
        this.ssrServer = server.listen(defaultSSRServerConfig.port, defaultSSRServerConfig.host);

        this.ssrServer.on("upgrade", assetsProxy.upgrade as (...args: unknown[]) => void);
        this.ssrServer.on("error", (error) => reject(error));
      });
    });
  }

  public async start() {
    const context = this.pluginApi.getContext();

    info(`clean dest files...`);

    await cleanDest(context, this.pluginApi.resolve(this.projectConfig.outputDir));

    await this.init();

    const isLubanDirExists = pathExistsSync(context + "/src/.luban");

    if (!isLubanDirExists) {
      await produceBoilerplate(context);
    }

    await produceRoutesAndStore(context);

    await delay(1000);

    console.log();

    const queue = [this.startClientSide];

    if (this.projectConfig.ssr) {
      queue.push(this.startServerSide);
    }

    await Promise.all(queue.map((q) => q.call(this)));

    if (this.commandArgs.open || this.clientSideServerOptions.open) {
      openBrowser(this.CSRUrlList?.localUrlForBrowser || "");

      if (this.projectConfig.ssr) {
        openBrowser(this.SSRUrlList?.localUrlForBrowser || "");
      }
    }

    ["SIGINT", "SIGTERM"].forEach((signal) => {
      process.on(signal, () => {
        this.ssrServer?.close();
        this.csrServer?.close();
        process.exit();
      });
    });
  }
}

class ServeWrapper implements CommandPluginInstance<ServeCliArgs> {
  apply(params: CommandPluginApplyCallbackArgs<ServeCliArgs>) {
    const { api, projectConfig, args } = params;

    api.registerCommand(
      "serve",
      {
        description: "start development server",
        usage: "luban-cli-service serve [options]",
        options: {
          "--open": `open browser on server start`,
          "--mode": `specify env mode (default: development)`,
          "--host": `specify host (default: ${DEFAULT_HOST})`,
          "--port": `specify port (default: Client: ${defaultClientServerConfig.port}); Server: ${defaultSSRServerConfig.port}`,
          "--https": `use https (default: ${defaultClientServerConfig.https})`,
          "--public": `specify the public network URL for the HMR client`,
        },
      },
      async () => {
        const serve = new Serve(api, projectConfig, args);
        await serve.start();
      },
    );
  }

  addWebpackConfig(params: CommandPluginAddWebpackConfigCallbackArgs) {
    const { api, projectConfig } = params;

    api.addWebpackConfig("client");

    if (projectConfig.ssr) {
      api.addWebpackConfig("server");
    }
  }
}
export default ServeWrapper;
