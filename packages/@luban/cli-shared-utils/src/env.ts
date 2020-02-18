import childProcess from "child_process";

// @see https://segmentfault.com/a/1190000012939607
import LRU from "lru-cache";

const execSync = childProcess.execSync;

let _hasGit: boolean;
const _gitProjects = new LRU({
  max: 10,
  maxAge: 1000,
});

export const hasGit = function(): boolean {
  if (_hasGit != null) {
    return _hasGit;
  }
  try {
    execSync("git --version", { stdio: "ignore" });
    return (_hasGit = true);
  } catch (e) {
    return (_hasGit = false);
  }
};

export const hasProjectGit = function(cwd: string): boolean {
  if (_gitProjects.has(cwd)) {
    return !!_gitProjects.get(cwd);
  }

  let result;
  try {
    execSync("git status", { stdio: "ignore", cwd });
    result = true;
  } catch (e) {
    result = false;
  }
  _gitProjects.set(cwd, result);
  return result;
};

export const isWindows = process.platform === "win32";
export const isMacintosh = process.platform === "darwin";
export const isLinux = process.platform === "linux";

const browsers: { chrome?: string | null; firefox?: string | null } = {};
let hasCheckedBrowsers: boolean = false;

function tryRun(cmd: string): string {
  try {
    return execSync(cmd, {
      stdio: [0, "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch (e) {
    return "";
  }
}

function getLinuxAppVersion(binary: string): string {
  return tryRun(`${binary} --version`).replace(/^.* ([^ ]*)/g, "$1");
}

function getMacAppVersion(bundleIdentifier: string): string | undefined {
  // mdfind kMDItemCFBundleIdentifier==com.google.Chrome
  const appPath = tryRun(`mdfind "kMDItemCFBundleIdentifier=='${bundleIdentifier}'"`);

  if (appPath) {
    // /usr/libexec/PlistBuddy -c Print:CFBundleShortVersionString /Applications/Firefox.app/Contents/Info.plist
    return tryRun(
      `/usr/libexec/PlistBuddy -c Print:CFBundleShortVersionString ${appPath.replace(
        /(\s)/g,
        "\\ ",
      )}/Contents/Info.plist`,
    );
  }
}

export const installedBrowsers = function(): typeof browsers {
  if (hasCheckedBrowsers) {
    return browsers;
  }
  hasCheckedBrowsers = true;

  if (isLinux) {
    browsers.chrome = getLinuxAppVersion("google-chrome");
    browsers.firefox = getLinuxAppVersion("firefox");
  } else if (isMacintosh) {
    browsers.chrome = getMacAppVersion("com.google.Chrome");
    browsers.firefox = getMacAppVersion("org.mozilla.firefox");
  } else if (isWindows) {
    // get chrome stable version
    // https://stackoverflow.com/a/51773107/2302258
    const chromeQueryResult =
      tryRun(
        'reg query "HKLM\\Software\\Google\\Update\\Clients\\{8A69D345-D564-463c-AFF1-A69D9E530F96}" /v pv /reg:32',
      ) ||
      tryRun(
        'reg query "HKCU\\Software\\Google\\Update\\Clients\\{8A69D345-D564-463c-AFF1-A69D9E530F96}" /v pv /reg:32',
      );
    if (chromeQueryResult) {
      const matched = chromeQueryResult.match(/REG_SZ\s+(\S*)$/);
      browsers.chrome = matched && matched[1];
    }

    // get firefox version
    // https://community.spiceworks.com/topic/111518-how-to-determine-version-of-installed-firefox-in-windows-batchscript
    const firefoxQueryResult = tryRun(
      'reg query "HKLM\\Software\\Mozilla\\Mozilla Firefox" /v CurrentVersion',
    );
    if (firefoxQueryResult) {
      const matched = firefoxQueryResult.match(/REG_SZ\s+(\S*)$/);
      browsers.firefox = matched && matched[1];
    }
  }

  return browsers;
};
