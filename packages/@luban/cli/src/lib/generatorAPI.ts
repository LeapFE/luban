import fs from "fs";
import ejs, { Options as EJSOptions, Data as EJSRenderInputData } from "ejs";
import path from "path";
import merge from "deepmerge";
import resolve from "resolve";
import { isBinaryFileSync } from "isbinaryfile";
import globby from "globby";
import yaml = require("yaml-front-matter");

import { resolveDeps } from "../utils/mergeDeps";
import { mergeArrayWithDedupe } from "../utils/configTransforms";
import { fileMiddlewareCallback, Generator } from "./generator";
import { BasePkgFields, RootOptions } from "../definitions";
import execa, { ExecaChildProcess } from "execa";

const isObject = (val: unknown): boolean => val !== null && typeof val === "object";

function extractCallDir(): string {
  // extract api.render() callsite file location using error stack
  const obj: { stack: string } = { stack: "" };
  Error.captureStackTrace(obj);
  const callSite = obj.stack.split("\n")[3];

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const fileName = callSite.match(/\s\((.*):\d+:\d+\)$/)[1];
  return path.dirname(fileName);
}

const replaceBlockRE = /<%# REPLACE %>([^]*?)<%# END_REPLACE %>/g;

function renderFile(name: string, data: EJSRenderInputData, ejsOptions: EJSOptions): string {
  if (isBinaryFileSync(name)) {
    return fs.readFileSync(name).toString();
  }
  const template = fs.readFileSync(name, "utf-8");

  // custom template inheritance via yaml front matter.
  // ---
  // extend: 'source-file'
  // replace: !!js/regexp /some-regex/
  // OR
  // replace:
  //   - !!js/regexp /foo/
  //   - !!js/regexp /bar/
  // ---

  const parsed = yaml.loadFront(template);
  const content = parsed.__content;
  let finalTemplate = content.trim() + `\n`;

  if (parsed.when) {
    finalTemplate = `<%_ if (${parsed.when}) { _%>` + finalTemplate + `<%_ } _%>`;

    // use ejs.render to test the conditional expression
    // if evaluated to falsy value, return early to avoid extra cost for extend expression
    const result = ejs.render(finalTemplate, data, ejsOptions);
    if (!result) {
      return "";
    }
  }

  if (parsed.extend) {
    const extendPath = path.isAbsolute(parsed.extend)
      ? parsed.extend
      : resolve.sync(parsed.extend, { basedir: path.dirname(name) });
    finalTemplate = fs.readFileSync(extendPath, "utf-8");
    if (parsed.replace) {
      if (Array.isArray(parsed.replace)) {
        const replaceMatch = content.match(replaceBlockRE);
        if (replaceMatch) {
          const replaces = replaceMatch.map((m: string) => {
            return m.replace(replaceBlockRE, "$1").trim();
          });
          parsed.replace.forEach((r: string, i: number) => {
            finalTemplate = finalTemplate.replace(r, replaces[i]);
          });
        }
      } else {
        finalTemplate = finalTemplate.replace(parsed.replace, content.trim());
      }
    }
  }

  return ejs.render(finalTemplate, data, { ...ejsOptions, async: false });
}

class GeneratorAPI {
  private readonly id: string;
  private readonly generator: Generator;
  private readonly options: Record<string, any>;
  private readonly rootOptions: Record<string, any>;
  private readonly pluginsData: Array<{ name: string; link: string }>;
  private _entryFile: string | undefined;

  /**
   * @param {string} id - Id of the owner plugin
   * @param {Generator} generator - The invoking Generator instance
   * @param {object} options - generator options passed to this plugin
   * @param {object} rootOptions - root options (the entire preset)
   */
  constructor(
    id: string,
    generator: Generator,
    options: Record<string, any>,
    rootOptions: RootOptions,
  ) {
    this.id = id;
    this.generator = generator;
    this.options = options;
    this.rootOptions = rootOptions;

    this.pluginsData = generator.plugins
      .filter(({ id }) => id !== "@luban-cli/cli-plugin-service")
      .map(({ id }) => ({
        name: id,
        link: "",
      }));

    this._entryFile = undefined;
  }

  /**
   * Resolves the data when rendering templates.
   */
  private _resolveData(additionalData: Record<string, any>): Record<string, any> {
    return Object.assign(
      {
        options: this.options,
        rootOptions: this.rootOptions,
        plugins: this.pluginsData,
      },
      additionalData,
    );
  }

  /**
   * Inject a file processing middleware.
   *
   * @param {FileMiddleware} middleware - A middleware function that receives the
   *   virtual files tree object, and an ejs render function. Can be async.
   */
  private _injectFileMiddleware(middleware: fileMiddlewareCallback): void {
    this.generator.fileMiddlewares.push(middleware);
  }

  /**
   * Resolve path for a project.
   *
   * @param {string} _path - Relative path from project root
   * @return {string} The resolved absolute path.
   */
  public resolve(_path: string): string {
    return path.resolve(this.generator.context, _path);
  }

  public get cliVersion(): string {
    return require("../package.json").version;
  }

  /**
   * Check if the project has a given plugin.
   *
   * @param {string} id - Plugin id
   * @param {string} version - Plugin version. Defaults to ''
   * @return {boolean}
   */
  public hasPlugin(id: string, version: string): boolean {
    return this.generator.hasPlugin(id, version);
  }

  /**
   * Extend the package.json of the project.
   * Nested fields are deep-merged unless `{ merge: false }` is passed.
   * Also resolves dependency conflicts between plugins.
   * Tool configuration fields may be extracted into standalone files before
   * files are written to disk.
   *
   * @param {object | () => object} fields - Fields to merge.
   * @param {boolean} forceNewVersion - Ignore version conflicts when updating dependency version
   */
  public extendPackage(
    fields: Partial<BasePkgFields> | ((pbk: Partial<BasePkgFields>) => Partial<BasePkgFields>),
    forceNewVersion?: boolean,
  ): void {
    const pkg = this.generator.pkg;
    const toMerge = typeof fields === "function" ? fields(pkg) : fields;

    for (const key in toMerge) {
      const value = toMerge[key];
      const existing = pkg[key];
      if (isObject(value) && (key === "dependencies" || key === "devDependencies")) {
        // use special version resolution merge
        pkg[key] = resolveDeps(this.id, existing || {}, value, {}, forceNewVersion);
      } else if (!(key in pkg)) {
        pkg[key] = value;
      } else if (Array.isArray(value) && Array.isArray(existing)) {
        pkg[key] = mergeArrayWithDedupe(existing, value);
      } else if (isObject(value) && isObject(existing)) {
        pkg[key] = merge(existing, value, { arrayMerge: mergeArrayWithDedupe });
      } else {
        pkg[key] = value;
      }
    }
  }

  /**
   * Render template files into the virtual files tree object.
   *
   * @param {string | object | FileMiddleware} source -
   *   Can be one of:
   *   - relative path to a directory;
   *   - Object hash of { sourceTemplate: targetFile } mappings;
   *   - a custom file middleware function.
   * @param {object} [additionalData] - additional data available to templates.
   * @param {object} [ejsOptions] - options for ejs.
   */
  public render(
    source: string | Record<string | number | symbol, any> | fileMiddlewareCallback,
    additionalData: Record<string, any> = {},
    ejsOptions: EJSOptions = {},
  ): void {
    const baseDir = extractCallDir();

    if (typeof source === "string") {
      source = path.resolve(baseDir, source);

      this._injectFileMiddleware(async (files) => {
        const data = this._resolveData(additionalData);
        const _files = await globby(["**/*"], { cwd: source as string });

        for (const rawPath of _files) {
          const targetPath = rawPath
            .split("/")
            .map((filename) => {
              // dotfiles are ignored when published to npm, therefore in templates
              // we need to use underscore instead (e.g. "_gitignore")
              if (filename.charAt(0) === "_" && filename.charAt(1) !== "_") {
                return `.${filename.slice(1)}`;
              }
              if (filename.charAt(0) === "_" && filename.charAt(1) === "_") {
                return `${filename.slice(1)}`;
              }
              return filename;
            })
            .join("/");

          const sourcePath = path.resolve(source as string, rawPath);
          const content = renderFile(sourcePath, data, ejsOptions);
          // only set file if it's not all whitespace, or is a Buffer (binary files)
          if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
            files[targetPath] = content;
          }
        }
      });
    } else if (typeof source === "object" && source !== null) {
      this._injectFileMiddleware((files) => {
        const data = this._resolveData(additionalData);

        for (const targetPath in source as Record<string | symbol | number, any>) {
          const sourcePath = path.resolve(baseDir, source[targetPath]);
          const content = renderFile(sourcePath, data, ejsOptions);
          if (Buffer.isBuffer(content) || content.trim()) {
            files[targetPath] = content;
          }
        }
      });
    } else if (typeof source === "function") {
      this._injectFileMiddleware(source);
    }
  }

  /**
   * Push a file middleware that will be applied after all normal file
   * middelwares have been applied.
   *
   * @param {FileMiddleware} cb
   */
  public postProcessFiles(cb: () => void): void {
    this.generator.postProcessFilesCbs.push(cb);
  }

  /**
   * Add a message to be printed when the generator exits (after any other standard messages).
   *
   * @param {} msg String or value to print after the generation is completed
   * @param {('log'|'info'|'done'|'warn'|'error')} [type='log'] Type of message
   */
  public addExitLog(msg: string, type = "log"): void {
    this.generator.exitLogs.push({ id: this.id, msg, type });
  }

  /**
   * Turns a string expression into executable JS for JS configs.
   * @param {*} str JS expression as a string
   */
  public static makeJSOnlyValue(str: string): () => void {
    const fn = (): undefined => undefined;
    fn.__expression = str;
    return fn;
  }

  /**
   * Get the entry file.
   *
   * @readonly
   */
  public get entryFile(): string {
    if (this._entryFile) return this._entryFile;
    this._entryFile = fs.existsSync(this.resolve("src/index.tsx"))
      ? "src/index.tsx"
      : "src/index.jsx";

    return this._entryFile;
  }

  public run(command: string, args?: any): ExecaChildProcess {
    if (!args) {
      [command, ...args] = command.split(/\s+/);
    }
    return execa(command, args, { cwd: this.generator.context });
  }

  public isGitRepository(): boolean {
    return fs.existsSync(path.join(this.generator.context, ".git"));
  }
}

export { GeneratorAPI };
