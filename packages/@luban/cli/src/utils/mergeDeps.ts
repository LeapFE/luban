import semver from "semver";
import { warn } from "@luban-cli/cli-shared-utils";

import { tryGetNewerRange } from "./tryGetNewerRange";

const extractSemver = function(r: string): string {
  return r.replace(/^.+#semver:/, "");
};
const injectSemver = function(r: string, v: string): string {
  return semver.validRange(r) ? v : r.replace(/#semver:.+$/, `#semver:${v}`);
};

export const resolveDeps = function(
  generatorId: string,
  to: Record<string, string>,
  from: Record<string, string>,
  sources: Record<string, string>,
  forceNewVersion?: boolean,
): Record<string, string> {
  const res = Object.assign({}, to);

  for (const name in from) {
    const r1 = to[name];
    const r2 = from[name];

    if (typeof r1 === "string" && typeof r2 === "string") {
      const sourceGeneratorId = sources[name];

      const isValidURI =
        r2.match(/^(?:file|git|git\+ssh|git\+http|git\+https|git\+file|https?):/) != null;

      const isValidGitHub = r2.match(/^[^/]+\/[^/]+/) != null;

      // if they are the same, do nothing. Helps when non semver type deps are used
      if (r1 === r2) continue;

      if (!isValidGitHub && !isValidURI && !semver.validRange(r2)) {
        warn(
          `invalid version range for dependency "${name}":\n\n` +
            `- ${r2} injected by generator "${generatorId}"`,
        );
        continue;
      }

      if (!r1) {
        res[name] = r2;
        sources[name] = generatorId;
      } else {
        const r1semver = extractSemver(r1);
        const r2semver = extractSemver(r2);
        const r = tryGetNewerRange(r1semver, r2semver);
        const didGetNewer = !!r;
        // if failed to infer newer version, use existing one because it's likely
        // built-in
        res[name] = didGetNewer ? injectSemver(r2, r || "") : r1;
        // if changed, update source
        if (res[name] === r2) {
          sources[name] = generatorId;
        }
        // warn incompatible version requirements
        if (
          !forceNewVersion &&
          (!semver.validRange(r1semver) ||
            !semver.validRange(r2semver) ||
            !semver.intersects(r1semver, r2semver))
        ) {
          warn(
            `conflicting versions for project dependency "${name}":\n\n` +
              `- ${r1} injected by generator "${sourceGeneratorId}"\n` +
              `- ${r2} injected by generator "${generatorId}"\n\n` +
              `Using ${didGetNewer ? `newer ` : ``}version (${
                res[name]
              }), but this may cause build errors.`,
          );
        }
      }
    }
  }

  return res;
};
