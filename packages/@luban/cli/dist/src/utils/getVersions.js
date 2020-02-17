"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = require("semver");
const packageManager_1 = require("./packageManager");
const pm = new packageManager_1.PackageManager({ context: process.cwd() });
function getAndCacheLatestVersion(cached) {
    return __awaiter(this, void 0, void 0, function* () {
        const version = yield pm.getRemoteVersion("@luban/cli", "latest");
        if (!version) {
            return cached;
        }
        if (semver_1.valid(version) && version !== cached) {
            return version;
        }
        return cached;
    });
}
function getVersions() {
    return __awaiter(this, void 0, void 0, function* () {
        const local = require("./../../package.json").version;
        let latest = "";
        const lastChecked = 0;
        const latestVersion = local;
        const cached = latestVersion;
        const daysPassed = (Date.now() - lastChecked) / (60 * 60 * 1000 * 24);
        if (daysPassed > 1) {
            try {
                latest = yield getAndCacheLatestVersion(cached);
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
    });
}
exports.getVersions = getVersions;
//# sourceMappingURL=getVersions.js.map