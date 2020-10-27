import { Configuration } from "webpack";

export function get(target: Configuration, path: string): any {
  const fields = path.split(".");

  let obj = target;

  const l = fields.length;

  for (let i = 0; i < l - 1; i++) {
    const key = fields[i];

    if (!obj[key]) {
      return undefined;
    }

    obj = obj[key];
  }

  return obj[fields[l - 1]];
}
