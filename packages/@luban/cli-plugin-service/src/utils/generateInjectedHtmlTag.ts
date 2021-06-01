export interface GenerateInjectedTag {
  (assetsManifest: Record<string, string>, path: string): {
    injectedStyles: string[];
    injectedScripts: string[];
  };
}
export const generateInjectedTag: GenerateInjectedTag = (assetsManifest, path) => {
  const injectedStyles: string[] = [];
  const injectedScripts: string[] = [];

  const noSlashPath = path.split("/").join("-");

  Object.keys(assetsManifest).forEach((item) => {
    const ext = item.substring(item.lastIndexOf("."));

    if (item.includes(noSlashPath)) {
      if (ext === ".js") {
        injectedScripts.push(`<script src="${assetsManifest[item]}"></script>`);
      }

      if (ext === ".css") {
        injectedStyles.push(`<link href="${assetsManifest[item]}" rel="stylesheet">`);
      }
    }
  });

  return { injectedStyles, injectedScripts };
};
