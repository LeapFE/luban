"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const open_1 = __importDefault(require("open"));
const execa_1 = __importDefault(require("execa"));
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
const OSX_CHROME = "google chrome";
const Actions = Object.freeze({
    NONE: 0,
    BROWSER: 1,
    SCRIPT: 2,
});
function getBrowserEnv() {
    const value = process.env.BROWSER || "";
    let action;
    if (!value) {
        action = Actions.BROWSER;
    }
    else if (value.toLowerCase().endsWith(".js")) {
        action = Actions.SCRIPT;
    }
    else if (value.toLowerCase() === "none") {
        action = Actions.NONE;
    }
    else {
        action = Actions.BROWSER;
    }
    return { action, value };
}
function executeNodeScript(scriptPath, url) {
    const extraArgs = process.argv.slice(2);
    const child = execa_1.default("node", [scriptPath, ...extraArgs, url], {
        stdio: "inherit",
    });
    child.on("close", (code) => {
        if (code !== 0) {
            console.log();
            console.log(chalk_1.default.red("The script specified as BROWSER environment variable failed."));
            console.log(chalk_1.default.cyan(scriptPath) + " exited with code " + code + ".");
            console.log();
            return;
        }
    });
    return true;
}
function startBrowserProcess(browser, url) {
    const shouldTryOpenChromeWithAppleScript = process.platform === "darwin" && (typeof browser !== "string" || browser === OSX_CHROME);
    if (shouldTryOpenChromeWithAppleScript) {
        try {
            child_process_1.execSync('ps cax | grep "Google Chrome"');
            child_process_1.execSync('osascript openChrome.applescript "' + encodeURI(url) + '"', {
                cwd: __dirname,
                stdio: "ignore",
            });
            return true;
        }
        catch (err) {
        }
    }
    if (process.platform === "darwin" && browser === "open") {
        browser = undefined;
    }
    try {
        const options = { app: browser };
        open_1.default(url, options).catch(() => undefined);
        return true;
    }
    catch (err) {
        return false;
    }
}
exports.openBrowser = function (url) {
    const { action, value } = getBrowserEnv();
    switch (action) {
        case Actions.NONE:
            return false;
        case Actions.SCRIPT:
            return executeNodeScript(value, url);
        case Actions.BROWSER:
            return startBrowserProcess(value, url);
        default:
            throw new Error("Not implemented.");
    }
};
