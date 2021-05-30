import path from "path";
import webpack = require("webpack");
import portfinder from "portfinder";
import WebpackDevServer = require("webpack-dev-server");
import { Application } from "express";
import chalk from "chalk";
import { openBrowser, log, error, info, warn } from "@luban-cli/cli-shared-utils";
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
import https from "https";
import http from "http";

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
import {
  delay,
  getModuleFromString,
  getTemplate,
  generateInjectedTag,
} from "../utils/serverRender";
import { cleanDest } from "../utils/cleanDest";
import { getCertificate } from "../utils/getCertificate";
import { CompileErrorTrace } from "../utils/formatCompileError";

type ServerSideHttpsOptions = { key?: Buffer; cert?: Buffer; spdy: { protocols: string[] } };

const DEFAULT_SERVER_BUNDLE: ServerBundle = { default: () => null, createStore: () => null };

const DEFAULT_HOST = "0.0.0.0";
const DEFAULT_ENABLED_HTTPS = false;

const defaultClientServerConfig = {
  host: DEFAULT_HOST,
  port: 8080,
  https: DEFAULT_ENABLED_HTTPS,
};

const defaultSSRServerConfig = {
  host: DEFAULT_HOST,
  port: 3000,
  https: DEFAULT_ENABLED_HTTPS,
};

class Serve {
  private pluginApi: CommandPluginAPI;
  private projectConfig: ProjectConfig;
  private commandArgs: ParsedArgs<ServeCliArgs>;

  private CSRUrlList: UrlList | null;
  private SSRUrlList: UrlList | null;
  private csrServer: WebpackDevServer | null;
  private ssrServer: http.Server | https.Server | null;

  private clientSideHost: string;
  private clientSidePort: number;

  private serverSideHost: string;
  private serverSidePort: number;

  private publicUrl: string | null;

  private readonly useHttps: boolean;
  private readonly protocol: "https" | "http";

  private readonly clientSideServerOptions: WebpackDevServer.Configuration;

  private readonly clientSideWebpackConfig:
    | (webpack.Configuration & { devServer?: WebpackDevServer.Configuration })
    | undefined;
  private readonly serverSideWebpackConfig:
    | (webpack.Configuration & { devServer?: WebpackDevServer.Configuration })
    | undefined;

  private serverSideApp: null | Application;
  private readonly serverSideHttpsOptions: ServerSideHttpsOptions;
  private serverSideServer: https.Server | http.Server | null;

  constructor(api: CommandPluginAPI, projectConfig: ProjectConfig, args: ParsedArgs<ServeCliArgs>) {
    this.pluginApi = api;
    this.projectConfig = projectConfig;
    this.commandArgs = args;

    //TODO separate logic that prepare client side and server side
    this.clientSideWebpackConfig = api.resolveWebpackConfig("client");

    this.serverSideWebpackConfig = api.resolveWebpackConfig("server");

    this.clientSideServerOptions = Object.assign(this.clientSideWebpackConfig?.devServer || {});

    this.useHttps =
      args.https ||
      (this.clientSideServerOptions.https as boolean) ||
      defaultClientServerConfig.https;

    this.protocol = this.useHttps ? "https" : "http";

    this.serverSideHttpsOptions = { spdy: { protocols: ["h2", "http/1.1"] } };

    this.serverSideApp = null;
    this.serverSideServer = null;
  }

  private preparePorts() {
    //TODO separate logic that prepare client side and server side
    const ports = [defaultClientServerConfig.port, defaultSSRServerConfig.port];

    if (typeof this.commandArgs.port === "string") {
      const commandPorts = this.commandArgs.port.split(" ");
      if (typeof Number(commandPorts[0]) === "number") {
        ports[0] = Number(commandPorts[0]);
      }

      if (typeof Number(commandPorts[1]) === "number") {
        ports[1] = Number(commandPorts[1]) || defaultSSRServerConfig.port;
      }
    } else if (typeof this.commandArgs.port === "number") {
      ports[0] = Number(this.commandArgs.port || defaultClientServerConfig.port);
    }

    return ports;
  }

  private async init() {
    //TODO separate logic that prepare client side and server side
    const ports = this.preparePorts();

    this.clientSideHost =
      this.commandArgs.host || this.clientSideServerOptions.host || defaultClientServerConfig.host;

    const clientSidePort = this.clientSideServerOptions.port || ports[0];

    this.serverSideHost = this.clientSideHost;
    const serverSidePort = ports[1];

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

  private setupServerSideApp() {
    this.serverSideApp = express();
  }

  private setupServerSideHttps() {
    if (this.useHttps) {
      const fakeCert = getCertificate(this.pluginApi.getContext());
      this.serverSideHttpsOptions.key = fakeCert;
      this.serverSideHttpsOptions.cert = fakeCert;
    }
  }

  private createServerSideServer() {
    if (this.serverSideApp) {
      if (this.useHttps) {
        this.serverSideServer = https.createServer(this.serverSideHttpsOptions, this.serverSideApp);
      } else {
        this.serverSideServer = http.createServer(this.serverSideApp);
      }
    }
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
      overlay: false,
      https: this.protocol === "https",
      open: false,
      stats: {
        version: false,
        timings: true,
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        assets: false,
      },
      watchOptions: {
        ignored: [
          `${this.pluginApi.getContext()}/src/index.tsx`,
          `${this.pluginApi.getContext()}/src/route.ts`,
        ],
      },

      ...this.clientSideServerOptions,

      before: (app: Application) => {
        const mockConfig = this.pluginApi.getMockConfig();
        if (this.projectConfig.mock && mockConfig !== null) {
          info("setup development mock server...\n");
          setupMockServer(app, mockConfig || {});
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

          if (this.projectConfig.mock && this.pluginApi.getMockConfig() !== null) {
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

    this.setupServerSideApp();
    this.setupServerSideHttps();
    this.createServerSideServer();

    const mfs = new MemoryFS();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const server = this.serverSideApp!;

    const compiler = webpack(this.serverSideWebpackConfig);

    compiler.outputFileSystem = mfs;

    let serverBundle: ServerBundle = DEFAULT_SERVER_BUNDLE;

    let isModuleCompileException = false;
    let ModuleCompileMessage: Error | null = null;

    const watchCallback = (error: Error, stats: webpack.Stats) => {
      // never throw this error, just type narrow
      if (!this.serverSideWebpackConfig) {
        throw new Error("server side webpack config unable resolved; command [server]");
      }

      isModuleCompileException = false;

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

      let _module: { exports: ServerBundle } = { exports: DEFAULT_SERVER_BUNDLE };
      try {
        _module = getModuleFromString(bundle, "server-entry.js", {
          exports: DEFAULT_SERVER_BUNDLE,
        });
      } catch (ignored) {
        ModuleCompileMessage = ignored;
        isModuleCompileException = true;
      }

      serverBundle = _module.exports;
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
      secure: false,
    });

    server.use(this.projectConfig.publicPath, assetsProxy);

    let cachedState: Record<PropertyKey, unknown> = {};
    let cachedLocation: object = {};
    const shared: Record<PropertyKey, unknown> = {};

    // TODO handle /favicon.ico

    server.use(async (req, res, next) => {
      if (!serverBundle) {
        res.send("WAITING FOR SERVER SIDE BUILDING...");
        return;
      }

      if (isModuleCompileException) {
        res.send(CompileErrorTrace(ModuleCompileMessage?.message || "MODULE COMPILE EXCEPTION"));
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

        const context = {
          url: req.url,
          path: req.path,
          query: req.query,
          initProps: {},
          initState: {},
        };
        const staticRouterContext: StaticRouterContext = {
          location: { pathname: req.path, ...cachedLocation },
        };

        const store =
          typeof serverBundle.createStore === "function"
            ? serverBundle.createStore(cachedState)
            : null;

        let App = null;
        try {
          App = await serverBundle.default(context, staticRouterContext, store, shared);
        } catch (err) {
          error(`Execute server side entry exception: ${err}`, "Server side rendering");
        }

        const { injectedScripts, injectedStyles } = generateInjectedTag(
          JSON.parse(assetsManifestJson),
          req.path,
        );

        let document = "";
        if (App) {
          cachedState = context.initState;

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
          cachedLocation = staticRouterContext.location || {};
          res.status(302);
          res.setHeader("Location", staticRouterContext.url);
          res.end();
          return;
        } else {
          cachedLocation = {};
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
      });

      Loadable.preloadAll().then(() => {
        if (this.serverSideServer) {
          this.ssrServer = this.serverSideServer.listen(
            this.serverSidePort,
            this.serverSideHost,
            () => {
              if (isFirstSSRCompile) {
                isFirstSSRCompile = false;

                console.log();
                console.log(`  Server Side Rendering running at:`);
                console.log(
                  `  - Local:   ${chalk.cyan(this.SSRUrlList?.localUrlForTerminal || "")}`,
                );
                console.log(`  - Network: ${chalk.cyan(this.SSRUrlList?.lanUrlForTerminal || "")}`);
                console.log();

                resolve();
              }
            },
          );

          this.ssrServer.on("upgrade", assetsProxy.upgrade as (...args: unknown[]) => void);
          this.ssrServer.on("error", (error) => reject(error));
        }
      });
    });
  }

  public async start() {
    const context = this.pluginApi.getContext();

    await cleanDest(context, this.pluginApi.resolve(this.projectConfig.outputDir));

    await this.init();

    await delay(1000);

    console.log();

    const queue = [this.startClientSide];

    if (this.projectConfig.ssr) {
      queue.push(this.startServerSide);
    }

    await Promise.all(queue.map((q) => q.call(this)));

    if (this.commandArgs.open || this.clientSideServerOptions.open) {
      const openClientSide = openBrowser(this.CSRUrlList?.localUrlForBrowser || "");

      if (!openClientSide) {
        warn("open client side preview failed");
      }

      if (this.projectConfig.ssr) {
        const openServerSide = openBrowser(this.SSRUrlList?.localUrlForBrowser || "");

        if (!openServerSide) {
          warn("open server side preview failed");
        }
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
