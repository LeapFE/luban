import ejs, { Options as EJSOptions, Data as EJSRenderInputData } from "ejs";
import { isBinaryFileSync } from "isbinaryfile";
import fs from "fs";

export function renderFile(name: string, data: EJSRenderInputData, ejsOptions: EJSOptions): string {
  if (isBinaryFileSync(name)) {
    return fs.readFileSync(name).toString();
  }

  const template = fs.readFileSync(name, "utf-8");

  return ejs.render(template, data, { ...ejsOptions, async: false });
}
