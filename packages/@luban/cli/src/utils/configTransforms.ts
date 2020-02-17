import { loadModule } from "@luban/cli-shared-utils";
import merge from "deepmerge";
import { safeLoad, safeDump } from "js-yaml";


import { extendJSConfig } from "./extendJSConfig";
import { stringifyJS } from "./stringifyJS";


export const mergeArrayWithDedupe = (a: any, b: any): any[] => Array.from(new Set([...a, ...b]));
const mergeOptions = {
  arrayMerge: mergeArrayWithDedupe,
};

const isObject = (val: any): boolean => val && typeof val === "object";

const transformJS = {
  read: function({ filename, context }: { filename: string; context: string }): any {
    try {
      return loadModule(`./${filename}`, context, true);
    } catch (e) {
      return null;
    }
  },
  write: function({ value, existing, source }: { value: any; existing: any[]; source: any }): string {
    if (existing) {
      // We merge only the modified keys
      const changedData = {};
      Object.keys(value).forEach((key) => {
        const originalValue = existing[key];
        const newValue = value[key];
        if (Array.isArray(originalValue) && Array.isArray(newValue)) {
          changedData[key] = mergeArrayWithDedupe(originalValue, newValue);
        } else if (isObject(originalValue) && isObject(newValue)) {
          changedData[key] = merge(originalValue, newValue, mergeOptions);
        } else {
          changedData[key] = newValue;
        }
      });
      return extendJSConfig(changedData, source);
    } else {
      return `module.exports = ${stringifyJS(value)}`;
    }
  },
};

const transformJSON = {
  read: function({ source }: { source: any }): any {
    JSON.parse(source);
  },
  write: function({ value, existing }: { value: any; existing: any[] }): string {
    return JSON.stringify(merge(existing, value, mergeOptions), null, 2);
  },
};

const transformYAML = {
  read: function({ source }: { source: any }): any {
    safeLoad(source);
  },
  write: function({ value, existing }: { value: any; existing: any[] }): string {
    return safeDump(merge(existing, value, mergeOptions), {
      skipInvalid: true,
    });
  },
};

const transformLines = {
  read: function({ source }: { source: string }): string[] {
    return source.split("\n");
  },
  write: function({ value, existing }: { value?: string[]; existing?: string[] }): string {
    if (existing && value !== undefined) {
      value = existing.concat(value);
      // Dedupe
      value = value.filter((item: any, index: number) => {
        return value ? value.indexOf(item) === index : false;
      });
    }
    return value ? value.join("\n") : "";
  },
};

export const transformTypes = {
  js: transformJS,
  json: transformJSON,
  yaml: transformYAML,
  lines: transformLines,
};
