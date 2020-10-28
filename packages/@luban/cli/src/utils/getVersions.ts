import { gt, valid, SemVer, minor, major, diff, gte } from "semver";

import { PackageManager } from "./packageManager";

import pkg = require("../../package.json");

const pm = new PackageManager({ context: process.cwd() });

async function getAndCacheLatestVersion(cached: string): Promise<string | SemVer> {
  const version = await pm.getRemoteVersion("@luban-cli/cli", "latest");

  if (!version) {
    return cached;
  }

  if (valid(version) && version !== cached) {
    return version;
  }

  return cached;
}

async function getVersions(): Promise<{ current: string; latest: string; latestMinor: string }> {
  const local: string = pkg.version;

  let latest: string | SemVer = "";

  const lastChecked = 0;
  const latestVersion = local;
  const cached = latestVersion;
  const daysPassed = (Date.now() - lastChecked) / (60 * 60 * 1000 * 24);

  if (daysPassed > 1) {
    try {
      latest = await getAndCacheLatestVersion(cached);
    } catch (e) {
      latest = cached;
    }
  } else {
    getAndCacheLatestVersion(cached).catch(() => undefined);
    latest = cached;
  }

  if (gt(local, latest)) {
    latest = local;
  }

  let latestMinor = `${major(latest)}.${minor(latest)}.0`;

  const differenceTypeOfVersions = diff(local, latest);

  if (/major/.test(differenceTypeOfVersions || "major") || gte(local, latest)) {
    latestMinor = local;
  }

  return {
    current: local,
    latest: typeof latest === "string" ? latest : latest.format(),
    latestMinor,
  };
}

export { getVersions };
