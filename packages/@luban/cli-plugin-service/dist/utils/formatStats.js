"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_shared_utils_1 = require("@luban-cli/cli-shared-utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const zlib_1 = __importDefault(require("zlib"));
const chalk_1 = __importDefault(require("chalk"));
const url_1 = __importDefault(require("url"));
const ui = require("cliui")({ width: 80 });
function formatStats(stats, dir, api) {
    const json = stats.toJson({
        hash: false,
        modules: false,
        chunks: false,
    });
    let assets = json.assets;
    if (assets === undefined && Array.isArray(json.children)) {
        assets = json.children.reduce((acc, child) => acc.concat(child.assets), []);
    }
    if (assets === undefined) {
        return "";
    }
    const seenNames = new Map();
    const isJS = (val) => /\.js$/.test(val);
    const isCSS = (val) => /\.css$/.test(val);
    const isMinJS = (val) => /\.min\.js$/.test(val);
    assets = assets
        .map((a) => {
        a.name = url_1.default.parse(a.name).pathname || "";
        return a;
    })
        .filter((a) => {
        if (seenNames.has(a.name)) {
            return false;
        }
        seenNames.set(a.name, true);
        return isJS(a.name) || isCSS(a.name);
    })
        .sort((a, b) => {
        if (isJS(a.name) && isCSS(b.name))
            return -1;
        if (isCSS(a.name) && isJS(b.name))
            return 1;
        if (isMinJS(a.name) && !isMinJS(b.name))
            return -1;
        if (!isMinJS(a.name) && isMinJS(b.name))
            return 1;
        return b.size - a.size;
    });
    function formatSize(size) {
        return (size / 1024).toFixed(2) + " KiB";
    }
    function getGzippedSize(asset) {
        const filepath = api.resolve(path_1.default.join(dir, asset.name));
        const buffer = fs_1.default.readFileSync(filepath);
        return formatSize(zlib_1.default.gzipSync(buffer).length);
    }
    function makeRow(a, b, c) {
        return `  ${a}\t    ${b}\t ${c}`;
    }
    ui.div(makeRow(chalk_1.default.cyan.bold(`File`), chalk_1.default.cyan.bold(`Size`), chalk_1.default.cyan.bold(`Gzipped`)) +
        `\n\n` +
        assets
            .map((asset) => makeRow(/js$/.test(asset.name)
            ? chalk_1.default.green(path_1.default.join(dir, asset.name))
            : chalk_1.default.blue(path_1.default.join(dir, asset.name)), formatSize(asset.size), getGzippedSize(asset)))
            .join(`\n`));
    return `${ui.toString()}\n\n  ${chalk_1.default.gray(`Images and other types of assets omitted.`)}\n`;
}
exports.formatStats = formatStats;
function logStatsErrorsAndWarnings(stats) {
    if (stats.hasWarnings()) {
        cli_shared_utils_1.log("Some warnings occurred while compiling");
        cli_shared_utils_1.log();
        const { warnings } = stats.toJson({ warnings: true, errors: false });
        warnings.forEach((warning) => {
            cli_shared_utils_1.warn(warning);
        });
        cli_shared_utils_1.log();
    }
    if (stats.hasErrors()) {
        cli_shared_utils_1.log();
        const { errors } = stats.toJson({ warnings: false, moduleTrace: false });
        errors.forEach((err) => {
            cli_shared_utils_1.error(err);
        });
        cli_shared_utils_1.log();
    }
}
exports.logStatsErrorsAndWarnings = logStatsErrorsAndWarnings;
//# sourceMappingURL=formatStats.js.map