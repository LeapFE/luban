import fs from "fs-extra";
import path from "path";

function deleteRemovedFiles(
  directory: string,
  newFiles: Record<string, string>,
  previousFiles: Record<string, string>,
): Promise<void[]> {
  // get all files that are not in the new filesystem and are still existing
  const filesToDelete = Object.keys(previousFiles).filter((filename) => !newFiles[filename]);

  // delete each of these files
  return Promise.all(
    filesToDelete.map((filename) => {
      return fs.unlink(path.join(directory, filename));
    }),
  );
}

export const writeFileTree = async function(
  dir: string,
  files: Record<string, string>,
  previousFiles?: Record<string, string>,
): Promise<void> {
  if (previousFiles) {
    await deleteRemovedFiles(dir, files, previousFiles);
  }
  Object.keys(files).forEach((name) => {
    const filePath = path.join(dir, name);
    fs.ensureDirSync(path.dirname(filePath));
    fs.writeFileSync(filePath, files[name]);
  });
};
