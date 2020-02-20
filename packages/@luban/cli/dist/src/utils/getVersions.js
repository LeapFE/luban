"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = require("semver");
const packageManager_1 = require("./packageManager");
const pm = new packageManager_1.PackageManager({ context: process.cwd() });
async function getAndCacheLatestVersion(cached) {
    const version = await pm.getRemoteVersion("@luban-cli/cli", "latest");
    if (!version) {
        return cached;
    }
    if (semver_1.valid(version) && version !== cached) {
        return version;
    }
    return cached;
}
async function getVersions() {
    const local = require("./../../package.json").version;
    let latest = "";
    const lastChecked = 0;
    const latestVersion = local;
    const cached = latestVersion;
    const daysPassed = (Date.now() - lastChecked) / (60 * 60 * 1000 * 24);
    if (daysPassed > 1) {
        try {
            latest = await getAndCacheLatestVersion(cached);
        }
        catch (e) {
            latest = cached;
        }
    }
    else {
        getAndCacheLatestVersion(cached).catch(() => undefined);
        latest = cached;
    }
    if (semver_1.gt(local, latest)) {
        latest = local;
    }
    let latestMinor = `${semver_1.major(latest)}.${semver_1.minor(latest)}.0`;
    const differenceTypeOfVersions = semver_1.diff(local, latest);
    if (/major/.test(differenceTypeOfVersions || "major") || semver_1.gte(local, latest)) {
        latestMinor = local;
    }
    return {
        current: local,
        latest: typeof latest === "string" ? latest : latest.format(),
        latestMinor,
    };
}
exports.getVersions = getVersions;
//# sourceMappingURL=getVersions.js.map