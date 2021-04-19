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
import { setServerConfig } from "../utils/getServerSideConfig";

function isAbsoluteUrl(url: string): boolean {
  // A URL is considered absolute if it begins with "<scheme>://" or "//"
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

const defaultClientServerConfig = {
  host: "0.0.0.0",
  port: 8080,
  https: false,
};

const defaultSSRServerConfig = {
  host: "0.0.0.0",
  port: 3000,
  https: false,
};

class Serve implements CommandPluginInstance {
  private pluginApi: CommandPluginAPI;
  private projectOptions: ProjectConfig;
  private commandArgs: ParsedArgs<ServeCliArgs>;

  private CSRUrlList: UrlList | null;
  private SSRUrlList: UrlList | null;
  private csrServer: WebpackDevServer | null;
  private ssrServer: http.Server | null;

  private protocol: "https" | "http";

  private clientSideServerOptions: WebpackDevServer.Configuration;

  private clientSideWebpackConfig: webpack.Configuration;

  // private isProduction: boolean;

  constructor(api: CommandPluginAPI, options: ProjectConfig, args: ParsedArgs<ServeCliArgs>) {
    this.pluginApi = api;
    this.projectOptions = options;
    this.commandArgs = args;

    // this.isProduction = process.env.NODE_ENV === "production";

    const defaultEntryFile = api.getClientSideEntryFile();
    const entryFile = args.entry || `src/${defaultEntryFile}`;

    if (!pathExistsSync(api.resolve(entryFile))) {
      error(`The entry file ${entryFile} not exit, please check it`);
      process.exit();
    }

    const webpackConfig = api.resolveWebpackConfig("client");

    webpackConfig.entry = {
      app: api.resolve("src/.luban/client.entry.tsx"),
    };

    this.clientSideWebpackConfig = webpackConfig;

    this.clientSideServerOptions = Object.assign(webpackConfig.devServer || {}, options.devServer);

    const useHttps =
      args.https || this.clientSideServerOptions.https || defaultClientServerConfig.https;
    this.protocol = useHttps ? "https" : "http";
  }

  private async startClientSide() {
    const host =
      this.commandArgs.host ||
      process.env.DEV_SERVER_HOST ||
      this.clientSideServerOptions.host ||
      defaultClientServerConfig.host;

    const _port =
      this.commandArgs.port ||
      process.env.DEV_SERVER_PORT ||
      this.clientSideServerOptions.port ||
      defaultClientServerConfig.port;

    const port = await portfinder.getPortPromise({ port: Number(_port) });

    const rawPublicUrl = this.commandArgs.public || this.clientSideServerOptions.public;
    const publicUrl = rawPublicUrl
      ? /^[a-zA-Z]+:\/\//.test(rawPublicUrl)
        ? rawPublicUrl
        : `${this.protocol}://${rawPublicUrl}`
      : null;

    this.CSRUrlList = prepareUrls(
      this.protocol,
      host,
      port,
      isAbsoluteUrl(this.projectOptions.publicPath) ? "/" : this.projectOptions.publicPath,
    );

    const compiler = webpack(this.clientSideWebpackConfig);

    const webpackDevServerOptions: WebpackDevServer.Configuration = {
      clientLogLevel: "info",
      historyApiFallback: {
        disableDotRule: true,
        rewrites: [
          { from: /./, to: path.posix.join(this.projectOptions.publicPath || "/", "index.html") },
        ],
      },
      contentBase: this.pluginApi.resolve("public"),
      watchContentBase: true,
      hot: true,
      compress: true,
      publicPath: this.projectOptions.publicPath,
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
        if (this.projectOptions.mock && this.pluginApi.service.mockConfig !== null) {
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

        const networkUrl = publicUrl
          ? publicUrl.replace(/([^/])$/, "$1/")
          : this.CSRUrlList?.lanUrlForTerminal || "";

        if (isFirstCompile) {
          isFirstCompile = false;

          console.log();
          console.log(`  App running at:`);
          console.log(`  - Local:   ${chalk.cyan(this.CSRUrlList?.localUrlForTerminal || "")}`);
          console.log(`  - Network: ${chalk.cyan(networkUrl)}`);
          console.log();

          if (this.projectOptions.mock && this.pluginApi.service.mockConfig !== null) {
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

      this.csrServer?.listen(port, host, (err?: Error) => {
        if (err) {
          reject(err);
        }
      });
    });
  }

  private startServerSide() {
    const mfs = new MemoryFS();

    const server = express();
    const ssrWebpackConfig = setServerConfig(
      "development",
      this.projectOptions.publicPath,
      this.pluginApi.resolve("src"),
      this.projectOptions.outputDir,
    );

    this.SSRUrlList = prepareUrls(this.protocol, defaultClientServerConfig.host, 3000, "/");

    const compiler = webpack(ssrWebpackConfig);

    compiler.outputFileSystem = mfs;

    let serverBundle: ServerBundle = { default: () => null, createStore: () => null };

    compiler.watch({}, (error, stats) => {
      if (error) {
        throw error;
      }

      const info = stats.toJson();
      info.errors.forEach((error) => console.error(error));
      info.warnings.forEach((warn) => console.warn(warn));

      let bundlePath = "";
      if (ssrWebpackConfig.output) {
        if (typeof ssrWebpackConfig.output.filename === "string") {
          bundlePath = path.join(
            ssrWebpackConfig.output.path || "",
            ssrWebpackConfig.output.filename,
          );
        }
      }

      const bundle = mfs.readFileSync(bundlePath, "utf-8");

      const m = getModuleFromString(bundle, "server-entry.js");

      serverBundle = m.exports;
    });

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

    server.use(this.projectOptions.publicPath, assetsProxy);

    // TODO handle /favicon.ico

    server.use(async (req, res, next) => {
      if (!serverBundle) {
        res.send("waiting for server side building...");
        return;
      }

      try {
        const templateUrl =
          this.CSRUrlList?.localUrlForBrowser + this.projectOptions.publicPath + "server.ejs";
        const assetsManifestJsonUrl =
          this.CSRUrlList?.localUrlForBrowser +
          this.projectOptions.publicPath +
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
      function (err, _, res, _next) {
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
          console.log(`  SSR running at:`);
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
    const isLubanDirExists = pathExistsSync(context + "/src/.luban");

    if (!isLubanDirExists) {
      await produceBoilerplate(context);
    }

    await produceRoutesAndStore(context);

    await delay(1000);

    console.log();

    const queue = [this.startClientSide()];

    if (this.projectOptions.ssr) {
      queue.push(this.startServerSide());
    }

    await Promise.all(queue);

    if (this.commandArgs.open || this.clientSideServerOptions.open) {
      openBrowser(this.CSRUrlList?.localUrlForBrowser || "");

      if (this.projectOptions.ssr) {
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

  public apply(params: CommandPluginApplyCallbackArgs) {
    const { api, projectConfig } = params;

    api.registerCommand(
      "serve",
      {
        description: "start development server",
        usage: "luban-cli-service serve [options]",
        options: {
          "--open": `open browser on server start`,
          "--mode": `specify env mode (default: development)`,
          "--host": `specify host (default: ${defaultClientServerConfig.host})`,
          "--port": `specify port (default: ${defaultClientServerConfig.port})`,
          "--https": `use https (default: ${defaultClientServerConfig.https})`,
          "--public": `specify the public network URL for the HMR client`,
        },
      },
      async (args: ParsedArgs<ServeCliArgs>) => {
        const serve = new Serve(api, projectConfig, args);
        await serve.start();
      },
    );
  }
}

export default Serve;
