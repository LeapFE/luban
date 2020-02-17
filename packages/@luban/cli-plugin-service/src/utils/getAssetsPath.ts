import { ProjectConfig } from "./../definitions";

import path from "path";

export const getAssetsPath = function(options: ProjectConfig, filePath: string): string {
  return options.assetsDir ? path.posix.join(options.assetsDir, filePath) : filePath;
};
