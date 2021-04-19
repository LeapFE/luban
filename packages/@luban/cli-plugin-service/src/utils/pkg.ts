import path from "path";
import fs from "fs-extra";
import readPkg from "read-pkg";

import { BasePkgFields, RootOptions } from "../definitions";
import { defaultPackageFields, defaultRootOptions } from "../lib/constant";

export function resolvePkg(context: string): BasePkgFields {
  if (fs.pathExistsSync(path.join(context, "package.json"))) {
    return readPkg.sync({ cwd: context }) as BasePkgFields;
  } else {
    return defaultPackageFields;
  }
}

export function resolveLubanConfig(pkg: BasePkgFields): Required<RootOptions> {
  let initConfig: Required<RootOptions> = defaultRootOptions;

  if (pkg.__luban_config__) {
    initConfig = pkg.__luban_config__ as Required<RootOptions>;
  }

  return initConfig;
}
