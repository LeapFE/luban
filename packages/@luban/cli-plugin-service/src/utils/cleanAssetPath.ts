export function cleanAssetPath(path: string) {
  return path.replace(/(\/{2,})/g, "/").replace(/^\/|\/$/g, "");
}

export function padTailSlash(path: string) {
  return path.replace(/([^/])$/, "$1/");
}
