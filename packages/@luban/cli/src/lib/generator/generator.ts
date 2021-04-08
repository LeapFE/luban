import ejs, { render as EJSRenderFunction } from "ejs";
import semver from "semver";
import { writeFileTree, log, info, done, warn, error } from "@luban-cli/cli-shared-utils";

import { GeneratorAPI } from "./generatorAPI";
import { PackageManager } from "../../utils/packageManager";
import { sortObject } from "../../utils/sortObject";

import { ResolvedPlugin, BasePkgFields, RootOptions } from "../../definitions";
import { defaultRootOptions } from "../../constants";

const logTypes = {
  log,
  info,
  done,
  warn,
  error,
};

type RestParams = {
  pkg?: BasePkgFields;
  plugins: ResolvedPlugin[];
  files?: Record<string, string>;
};

export type fileMiddlewareCallback = (
  files: Record<string, string>,
  render: typeof EJSRenderFunction,
) => Promise<void> | void;

export class Generator {
  public readonly context: string;
  public readonly plugins: ResolvedPlugin[];
  public pkg: BasePkgFields;
  private readonly pm: PackageManager;
  public readonly rootOptions: Required<RootOptions>;
  private readonly files: Record<string, string>;
  public readonly fileMiddlewares: Array<fileMiddlewareCallback>;
  public postProcessFilesCbs: Array<(files: Record<string, string>) => void>;
  private readonly allPluginIds: string[];
  public readonly exitLogs: Array<{ id: string; msg: string; type: string }>;

  constructor(
    context: string,
    { pkg = { name: "", version: "" }, plugins, files = {} }: RestParams,
  ) {
    this.context = context;
    this.plugins = plugins;
    this.pkg = Object.assign({}, pkg);
    this.pm = new PackageManager({ context });

    // virtual file tree
    this.files = files;
    this.fileMiddlewares = [];
    this.postProcessFilesCbs = [];
    // exit messages
    this.exitLogs = [];

    // load all the other plugins
    this.allPluginIds = Object.keys(this.pkg.dependencies || {}).concat(
      Object.keys(this.pkg.devDependencies || {}),
    );

    this.rootOptions = pkg.__luban_config__ || defaultRootOptions;
  }

  public async initPlugins(): Promise<void> {
    const { rootOptions } = this;

    // apply generator from plugin
    for (const plugin of this.plugins) {
      const { id, apply, options } = plugin;
      const api = new GeneratorAPI(id, this, options, rootOptions);
      await apply(api, rootOptions);
    }
  }

  public async generate(): Promise<void> {
    await this.initPlugins();

    // save the file system before applying plugin for comparison
    const initialFiles = Object.assign({}, this.files);
    // extract configs from package.json into dedicated files.
    // wait for file resolve
    await this.resolveFiles();
    // set package.json
    this.sortPkg();
    this.files["package.json"] = JSON.stringify(this.pkg, null, 2) + "\n";
    // write/update file tree to disk
    await writeFileTree(this.context, this.files, initialFiles);
  }

  public sortPkg(): void {
    // ensure package.json keys has readable order
    this.pkg.dependencies = sortObject(this.pkg.dependencies || {});
    this.pkg.devDependencies = sortObject(this.pkg.devDependencies || {});
    this.pkg.scripts = sortObject(this.pkg.scripts || {}, ["dev", "build", "test:unit", "lint"]);
    this.pkg = sortObject(this.pkg, [
      "name",
      "version",
      "private",
      "description",
      "author",
      "scripts",
      "main",
      "module",
      "browser",
      "jsDelivr",
      "unpkg",
      "files",
      "dependencies",
      "devDependencies",
      "peerDependencies",
      "babel",
      "eslintConfig",
      "prettier",
      "postcss",
      "browserslist",
      "jest",
    ]) as BasePkgFields;
  }

  public async resolveFiles(): Promise<void> {
    const files = this.files;
    for (const middleware of this.fileMiddlewares) {
      await middleware(files, ejs.render);
    }

    for (const postProcess of this.postProcessFilesCbs) {
      await postProcess(files);
    }
  }

  public hasPlugin(_id: string, _version: string): boolean {
    return [...this.plugins.map((p) => p.id), ...this.allPluginIds].some((id) => {
      if (id !== _id) {
        return false;
      }

      if (!_version) {
        return true;
      }

      const version = this.pm.getInstalledVersion(id);
      return semver.satisfies(version, _version);
    });
  }

  public printExitLogs(): void {
    if (this.exitLogs.length) {
      this.exitLogs.forEach(({ id, msg, type }) => {
        const logFn = logTypes[type];
        if (!logFn) {
          error(`Invalid api.exitLog type '${type}'.`, id);
        } else {
          logFn(msg, msg && id);
        }
      });
      log();
    }
  }
}
