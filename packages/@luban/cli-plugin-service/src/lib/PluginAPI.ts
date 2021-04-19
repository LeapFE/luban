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
  WebpackConfiguration,
} from "../definitions";

class PluginAPI {
  public id: string;
  public service: Service;

  constructor(id: string, service: Service) {
    this.id = id;
    this.service = service;
  }

  public getContext(): string {
    return this.service.context;
  }

  public resolve(_path: string): string {
    return path.resolve(this.service.context, _path);
  }

  public hasPlugin(id: PLUGIN_IDS): boolean {
    const prefixRE = /^@luban-cli\/cli-plugin-/;
    return this.service.configPlugins.some((p) => {
      return p.id === id || p.id.replace(prefixRE, "") === id;
    });
  }

  public getClientSideEntryFile(): string {
    return "src/.luban/client.entry.tsx";
  }

  public getServerSideClientEntryFile(): string {
    return "src/.luban/server.entry.tsx";
  }
}

class CommandPluginAPI extends PluginAPI {
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

  public resolveChainableWebpackConfig(): Config {
    return this.service.resolveChainableWebpackConfig();
  }

  public resolveWebpackConfig(config?: Config): WebpackConfiguration {
    return this.service.resolveWebpackConfig(config);
  }
}

class ConfigPluginAPI extends PluginAPI {
  public chainWebpack(fn: WebpackChainCallback): void {
    this.service.webpackChainCallback.push(fn);
  }

  public configureWebpack(fn: WebpackRawConfigCallback): void {
    this.service.webpackRawConfigCallback.push(fn);
  }
}

export { CommandPluginAPI, ConfigPluginAPI };
