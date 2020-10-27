import path from "path";
import Config = require("webpack-chain");

import { Service } from "./Service";
import {
  WebpackChainCallback,
  WebpackRawConfigCallback,
  CommandCallback,
  PLUGIN_IDS,
  CliArgs,
  builtinServiceCommandName,
  RootOptions,
  WebpackConfiguration,
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
    const prefixRE = /^@luban-cli\/cli-plugin-/;
    return this.service.plugins.some((p) => {
      return p.id === id || p.id.replace(prefixRE, "") === id;
    });
  }

  public resolveInitConfig(): Required<RootOptions> {
    return this.service.resolveLubanConfig();
  }

  public getEntryFile(): string {
    return this.resolveInitConfig().language === "ts" ? "index.tsx" : "index.jsx";
  }

  // set project mode.
  // this should be called by any registered command as early as possible.
  public setMode(mode: string, commandName: builtinServiceCommandName): void {
    process.env.LUBAN_CLI_SERVICE_MODE = mode;
    this.service.loadAndSetEnv(mode, commandName);
  }

  public registerCommand(
    name: builtinServiceCommandName,
    opts: Record<string, unknown> | CommandCallback<CliArgs>,
    callback?: CommandCallback<CliArgs>,
  ): void {
    let commandCallback = callback;

    // if opts is function, ignore callback param
    if (typeof opts === "function") {
      commandCallback = opts;
      opts = {};
    }

    if (typeof commandCallback === "function") {
      this.service.commands[name] = { commandCallback, opts };
    }
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

  // TODO supported use function to config devServer
  // public configureDevServer(fn: WebpackDevServerConfigCallback): void {
  //   this.service.webpackDevServerConfigCallback.push(fn);
  // }
}

export { PluginAPI };
