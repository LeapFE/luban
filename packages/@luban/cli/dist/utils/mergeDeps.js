"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = __importDefault(require("semver"));
const cli_shared_utils_1 = require("@luban-cli/cli-shared-utils");
const tryGetNewerRange_1 = require("./tryGetNewerRange");
const extractSemver = function (r) {
    return r.replace(/^.+#semver:/, "");
};
const injectSemver = function (r, v) {
    return semver_1.default.validRange(r) ? v : r.replace(/#semver:.+$/, `#semver:${v}`);
};
exports.resolveDeps = function (generatorId, to, from, sources, forceNewVersion) {
    const res = Object.assign({}, to);
    for (const name in from) {
        const r1 = to[name];
        const r2 = from[name];
        const sourceGeneratorId = sources[name];
        const isValidURI = r2.match(/^(?:file|git|git\+ssh|git\+http|git\+https|git\+file|https?):/) != null;
        const isValidGitHub = r2.match(/^[^/]+\/[^/]+/) != null;
        if (r1 === r2)
            continue;
        if (!isValidGitHub && !isValidURI && !semver_1.default.validRange(r2)) {
            cli_shared_utils_1.warn(`invalid version range for dependency "${name}":\n\n` +
                `- ${r2} injected by generator "${generatorId}"`);
            continue;
        }
        if (!r1) {
            res[name] = r2;
            sources[name] = generatorId;
        }
        else {
            const r1semver = extractSemver(r1);
            const r2semver = extractSemver(r2);
            const r = tryGetNewerRange_1.tryGetNewerRange(r1semver, r2semver);
            const didGetNewer = !!r;
            res[name] = didGetNewer ? injectSemver(r2, r || "") : r1;
            if (res[name] === r2) {
                sources[name] = generatorId;
            }
            if (!forceNewVersion &&
                (!semver_1.default.validRange(r1semver) ||
                    !semver_1.default.validRange(r2semver) ||
                    !semver_1.default.intersects(r1semver, r2semver))) {
                cli_shared_utils_1.warn(`conflicting versions for project dependency "${name}":\n\n` +
                    `- ${r1} injected by generator "${sourceGeneratorId}"\n` +
                    `- ${r2} injected by generator "${generatorId}"\n\n` +
                    `Using ${didGetNewer ? `newer ` : ``}version (${res[name]}), but this may cause build errors.`);
            }
        }
    }
    return res;
};
//# sourceMappingURL=mergeDeps.js.map