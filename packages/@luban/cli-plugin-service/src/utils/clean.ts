import fs from "fs-extra";
import path from "path";

export async function cleanDest(context: string, outputDir: string) {
  const _path = path.resolve(context, outputDir);
  if (fs.pathExistsSync(_path)) {
    await fs.remove(_path);
  }
}
