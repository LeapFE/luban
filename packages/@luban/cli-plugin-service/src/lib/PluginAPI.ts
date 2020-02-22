import path from "path";
import Config from "webpack-chain";

import { Service } from "./Service";
import {
  WebpackChainCallback,
  WebpackRawConfigCallback,
  WebpackDevServerConfigCallback,
  CommandFn,
  WebpackConfiguration,
  Preset,
  PLUGIN_IDS,
  CliArgs,
} from "../definitions";

class PluginAPI {
  public id: string;
  public service: Service;

  constructor(id: string, service: Service) {
    this.id = id;
    this.service = service;
  }

  public getCwd(): string {
    return this.service.context;
  }

  public resolve(_path: string): string {
    return path.resolve(this.service.context, _path);
  }

  public hasPlugin(id: PLUGIN_IDS): boolean {
    const prefixRE = /^cli-plugin-/;
    return this.service.plugins.some((p) => {
      return p.id === id || p.id.replace(prefixRE, "") === id;
    });
  }

  public resolveInitConfig(): Preset {
    return this.service.resolveLubanConfig();
  }

  public getEntryFile(): string {
    return this.resolveInitConfig().language === "ts" ? "index.tsx" : "index.jsx";
  }

  // set project mode.
  // this should be called by any registered command as early as possible.
  public setMode(mode: string): void {
    process.env.LUBAN_CLI_SERVICE_MODE = mode;
    // by default, NODE_ENV and BABEL_ENV are set to "development" unless mode
    // is production or test. However this can be overwritten in .env files.
    process.env.NODE_ENV = process.env.BABEL_ENV =
      mode === "production" || mode === "test" ? mode : "development";
    // load .env files based on mode
    this.service.loadEnv(mode);
  }

  public registerCommand(
    name: string,
    opts: Record<string, any> | null | CommandFn<CliArgs>,
    fn: CommandFn<CliArgs>,
  ): void {
    if (typeof opts === "function") {
      fn = opts as CommandFn<CliArgs>;
      opts = null;
    }
    this.service.commands[name] = { fn, opts };
  }

  public chainWebpack(fn: WebpackChainCallback): void {
    this.service.webpackChainCallback.push(fn);
  }

  public configureWebpack(fn: WebpackRawConfigCallback): void {
    this.service.webpackRawConfigCallback.push(fn);
  }

  public resolveChainableWebpackConfig(): Config {
    return this.service.resolveChainableWebpackConfig();
  }

  public resolveWebpackConfig(config?: Config): WebpackConfiguration {
    return this.service.resolveWebpackConfig(config);
  }

  public configureDevServer(fn: WebpackDevServerConfigCallback): void {
    this.service.webpackDevServerConfigCallback.push(fn);
  }
}

export { PluginAPI };
