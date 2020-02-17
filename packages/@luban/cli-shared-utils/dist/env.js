"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __importDefault(require("child_process"));
const lru_cache_1 = __importDefault(require("lru-cache"));
const execSync = child_process_1.default.execSync;
let _hasGit;
const _gitProjects = new lru_cache_1.default({
    max: 10,
    maxAge: 1000,
});
exports.hasGit = function () {
    if (_hasGit != null) {
        return _hasGit;
    }
    try {
        execSync("git --version", { stdio: "ignore" });
        return (_hasGit = true);
    }
    catch (e) {
        return (_hasGit = false);
    }
};
exports.hasProjectGit = function (cwd) {
    if (_gitProjects.has(cwd)) {
        return !!_gitProjects.get(cwd);
    }
    let result;
    try {
        execSync("git status", { stdio: "ignore", cwd });
        result = true;
    }
    catch (e) {
        result = false;
    }
    _gitProjects.set(cwd, result);
    return result;
};
exports.isWindows = process.platform === "win32";
exports.isMacintosh = process.platform === "darwin";
exports.isLinux = process.platform === "linux";
const browsers = {};
let hasCheckedBrowsers = false;
function tryRun(cmd) {
    try {
        return execSync(cmd, {
            stdio: [0, "pipe", "ignore"],
        })
            .toString()
            .trim();
    }
    catch (e) {
        return "";
    }
}
function getLinuxAppVersion(binary) {
    return tryRun(`${binary} --version`).replace(/^.* ([^ ]*)/g, "$1");
}
function getMacAppVersion(bundleIdentifier) {
    const appPath = tryRun(`mdfind "kMDItemCFBundleIdentifier=='${bundleIdentifier}'"`);
    if (appPath) {
        return tryRun(`/usr/libexec/PlistBuddy -c Print:CFBundleShortVersionString ${appPath.replace(/(\s)/g, "\\ ")}/Contents/Info.plist`);
    }
}
exports.installedBrowsers = function () {
    if (hasCheckedBrowsers) {
        return browsers;
    }
    hasCheckedBrowsers = true;
    if (exports.isLinux) {
        browsers.chrome = getLinuxAppVersion("google-chrome");
        browsers.firefox = getLinuxAppVersion("firefox");
    }
    else if (exports.isMacintosh) {
        browsers.chrome = getMacAppVersion("com.google.Chrome");
        browsers.firefox = getMacAppVersion("org.mozilla.firefox");
    }
    else if (exports.isWindows) {
        const chromeQueryResult = tryRun('reg query "HKLM\\Software\\Google\\Update\\Clients\\{8A69D345-D564-463c-AFF1-A69D9E530F96}" /v pv /reg:32') ||
            tryRun('reg query "HKCU\\Software\\Google\\Update\\Clients\\{8A69D345-D564-463c-AFF1-A69D9E530F96}" /v pv /reg:32');
        if (chromeQueryResult) {
            const matched = chromeQueryResult.match(/REG_SZ\s+(\S*)$/);
            browsers.chrome = matched && matched[1];
        }
        const firefoxQueryResult = tryRun('reg query "HKLM\\Software\\Mozilla\\Mozilla Firefox" /v CurrentVersion');
        if (firefoxQueryResult) {
            const matched = firefoxQueryResult.match(/REG_SZ\s+(\S*)$/);
            browsers.firefox = matched && matched[1];
        }
    }
    return browsers;
};
