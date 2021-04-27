export function cleanAssetPath(path: string) {
  return path.replace(/(\/{2,})/g, "/").replace(/^\/|\/$/g, "");
}

export function removeSlash(path: string) {
  return path.replace(/^\/|\/$/g, "");
}
