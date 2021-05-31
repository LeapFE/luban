import fetch from "isomorphic-fetch";
import NativeModule from "module";
import vm from "vm";
import ejs, { Data, Options as EJSOptions } from "ejs";
import fs from "fs";
import path from "path";
import globby from "globby";
import https from "https";

import { ServerBundle } from "../definitions";

// https://github.com/node-fetch/node-fetch/issues/19
const agent = new https.Agent({ rejectUnauthorized: false });

export const getTemplate = (url: string): Promise<string> => {
  const useHttps = url.startsWith("https://");
  const options = useHttps ? { agent } : {};

  return new Promise((resolve, reject) => {
    fetch(url, options)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((response: any) => {
        if (response.status >= 400) {
          reject(new Error("Bad response from server"));
        }
        resolve(response.text());
      })
      .catch((error: unknown) => {
        reject(error);
      });
  });
};

export const getModuleFromString = (
  bundle: string,
  filename: string,
  initModule: { exports: ServerBundle },
) => {
  const _module: { exports: ServerBundle } = initModule;

  const wrapper = NativeModule.wrap(bundle);

  const script = new vm.Script(wrapper, {
    filename,
    displayErrors: false,
  });

  const result = script.runInThisContext();

  try {
    result.call(_module.exports, _module.exports, require, _module);
  } catch (ignored) {
    throw new Error(ignored);
  }

  return _module;
};

export function renderFile(name: string, data: Data, ejsOptions: EJSOptions = {}): string {
  const template = fs.readFileSync(name, "utf-8");

  return ejs.render(template, data, { ...ejsOptions, async: false });
}

function extractCallDir(): string {
  const errorStack: { stack: string } = { stack: "" };
  Error.captureStackTrace(errorStack);

  const callSite = errorStack.stack.split("\n")[3];

  if (callSite) {
    const fileNameMatchResult = callSite.match(/\s\((.*):\d+:\d+\)$/);
    if (Array.isArray(fileNameMatchResult)) {
      return path.dirname(fileNameMatchResult[1]);
    }
  }

  return "";
}

export async function render(
  dir: string,
  additionalData: Record<string, unknown> = {},
  ejsOptions: EJSOptions = {},
) {
  const baseDir = extractCallDir();

  const source = path.resolve(baseDir, dir);

  const _files = await globby(["**/*"], { cwd: source as string });

  const files: Record<string, string> = {};

  for (const rawPath of _files) {
    const sourcePath = path.resolve(source as string, rawPath);
    const content = renderFile(sourcePath, additionalData, ejsOptions);

    if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
      files[rawPath] = content;
    }
  }

  return files;
}

export function delay(value: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, value);
  });
}
