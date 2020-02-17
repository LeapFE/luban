"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = __importDefault(require("semver"));
const leadRE = /^(~|\^|>=?)/;
const rangeToVersion = function (r) {
    return r.replace(leadRE, "").replace(/x/g, "0");
};
function tryGetNewerRange(r1, r2) {
    const v1 = rangeToVersion(r1);
    const v2 = rangeToVersion(r2);
    if (semver_1.default.valid(v1) && semver_1.default.valid(v2)) {
        return semver_1.default.gt(v1, v2) ? r1 : r2;
    }
}
exports.tryGetNewerRange = tryGetNewerRange;
//# sourceMappingURL=tryGetNewerRange.js.map