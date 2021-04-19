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
  WebpackConfigName,
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

  public resolveChainableWebpackConfig(name: WebpackConfigName): Config {
    return this.service.resolveChainableWebpackConfig(name);
  }

  public resolveWebpackConfig(name: WebpackConfigName, config?: Config): WebpackConfiguration {
    return this.service.resolveWebpackConfig(name, config);
  }
}

class ConfigPluginAPI extends PluginAPI {
  public chainWebpack(name: WebpackConfigName, fn: WebpackChainCallback): void {
    this.service.webpackConfigList[name].chainCallback.push(fn);
  }

  public configureWebpack(name: WebpackConfigName, fn: WebpackRawConfigCallback): void {
    this.service.webpackConfigList[name].rawCallback.push(fn);
  }

  public configureAllWebpack(fn: WebpackRawConfigCallback): void {
    this.service.webpackConfigList["client"].rawCallback.push(fn);
    this.service.webpackConfigList["server"].rawCallback.push(fn);
  }

  public chainAllWebpack(fn: WebpackChainCallback): void {
    this.service.webpackConfigList["client"].chainCallback.push(fn);
    this.service.webpackConfigList["server"].chainCallback.push(fn);
  }
}

export { CommandPluginAPI, ConfigPluginAPI };
