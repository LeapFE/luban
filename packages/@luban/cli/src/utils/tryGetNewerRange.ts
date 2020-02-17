import semver from "semver";

const leadRE = /^(~|\^|>=?)/;
const rangeToVersion = function(r: string): string {
  return r.replace(leadRE, "").replace(/x/g, "0");
};

export function tryGetNewerRange(r1: string, r2: string): string | undefined {
  const v1 = rangeToVersion(r1);
  const v2 = rangeToVersion(r2);
  if (semver.valid(v1) && semver.valid(v2)) {
    return semver.gt(v1, v2) ? r1 : r2;
  }
}
