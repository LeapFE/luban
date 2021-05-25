import path from "path";

import { Service } from "./Service";
import {
  WebpackChainCallback,
  WebpackRawConfigCallback,
  CommandCallback,
  builtinServiceCommandName,
  WebpackConfiguration,
  WebpackConfigName,
} from "../definitions";

class PluginAPI {
  public readonly id: string;
  protected service: Service;

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

  public getClientSideEntryFile(): string {
    return path.resolve(this.service.context, "src/.luban/client.entry.tsx");
  }

  public getServerSideClientEntryFile(): string {
    return path.resolve(this.service.context, "src/.luban/server.entry.tsx");
  }

  public getMockConfig() {
    return this.service.mockConfig;
  }

  public getRegisteredCommands() {
    return this.service.commands;
  }
}

class CommandPluginAPI extends PluginAPI {
  public registerCommand(
    name: builtinServiceCommandName,
    opts: Record<string, unknown> | CommandCallback,
    callback?: CommandCallback,
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

  public addWebpackConfig(name: WebpackConfigName) {
    this.service.addWebpackConfigQueueItem(name);
  }

  public resolveWebpackConfig(name: WebpackConfigName): WebpackConfiguration | undefined {
    return this.service.resolveWebpackConfig(name);
  }
}

class ConfigPluginAPI extends PluginAPI {
  public configureWebpack(name: WebpackConfigName, fn: WebpackRawConfigCallback): void {
    const configQueue = this.service.webpackConfigQueue.get(name);
    configQueue?.rawCallback.push(fn);
  }

  public configureAllWebpack(fn: WebpackRawConfigCallback): void {
    this.service.webpackConfigQueue.forEach((queue) => {
      queue.rawCallback.push(fn);
    });
  }

  public chainWebpack(name: WebpackConfigName, fn: WebpackChainCallback): void {
    const configQueue = this.service.webpackConfigQueue.get(name);
    configQueue?.chainCallback.push(fn);
  }

  public chainAllWebpack(fn: WebpackChainCallback): void {
    this.service.webpackConfigQueue.forEach((queue) => {
      queue.chainCallback.push(fn);
    });
  }
}

export { CommandPluginAPI, ConfigPluginAPI };
