"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_shared_utils_1 = require("@luban-cli/cli-shared-utils");
const deepmerge_1 = __importDefault(require("deepmerge"));
const js_yaml_1 = require("js-yaml");
const extendJSConfig_1 = require("./extendJSConfig");
const stringifyJS_1 = require("./stringifyJS");
exports.mergeArrayWithDedupe = (a, b) => Array.from(new Set([...a, ...b]));
const mergeOptions = {
    arrayMerge: exports.mergeArrayWithDedupe,
};
const isObject = (val) => val && typeof val === "object";
const transformJS = {
    read: function ({ filename, context }) {
        try {
            return cli_shared_utils_1.loadModule(`./${filename}`, context, true);
        }
        catch (e) {
            return null;
        }
    },
    write: function ({ value, existing, source, }) {
        if (existing) {
            const changedData = {};
            Object.keys(value).forEach((key) => {
                const originalValue = existing[key];
                const newValue = value[key];
                if (Array.isArray(originalValue) && Array.isArray(newValue)) {
                    changedData[key] = exports.mergeArrayWithDedupe(originalValue, newValue);
                }
                else if (isObject(originalValue) && isObject(newValue)) {
                    changedData[key] = deepmerge_1.default(originalValue, newValue, mergeOptions);
                }
                else {
                    changedData[key] = newValue;
                }
            });
            return extendJSConfig_1.extendJSConfig(changedData, source);
        }
        else {
            return `module.exports = ${stringifyJS_1.stringifyJS(value)}`;
        }
    },
};
const transformJSON = {
    read: function ({ source }) {
        JSON.parse(source);
    },
    write: function ({ value, existing }) {
        return JSON.stringify(deepmerge_1.default(existing, value, mergeOptions), null, 2);
    },
};
const transformYAML = {
    read: function ({ source }) {
        js_yaml_1.safeLoad(source);
    },
    write: function ({ value, existing }) {
        return js_yaml_1.safeDump(deepmerge_1.default(existing, value, mergeOptions), {
            skipInvalid: true,
        });
    },
};
const transformLines = {
    read: function ({ source }) {
        return source.split("\n");
    },
    write: function ({ value, existing }) {
        if (existing && value !== undefined) {
            value = existing.concat(value);
            value = value.filter((item, index) => {
                return value ? value.indexOf(item) === index : false;
            });
        }
        return value ? value.join("\n") : "";
    },
};
exports.transformTypes = {
    js: transformJS,
    json: transformJSON,
    yaml: transformYAML,
    lines: transformLines,
};
//# sourceMappingURL=configTransforms.js.map