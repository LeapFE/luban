import ejs, { Options as EJSOptions, Data as EJSRenderInputData } from "ejs";
import { isBinaryFileSync } from "isbinaryfile";
import fs from "fs";
import { loadFront } from "yaml-front-matter";
import resolve from "resolve";
import path from "path";

const replaceBlockReg = /<%# REPLACE %>([^]*?)<%# END_REPLACE %>/g;

export function renderFile(name: string, data: EJSRenderInputData, ejsOptions: EJSOptions): string {
  if (isBinaryFileSync(name)) {
    return fs.readFileSync(name).toString();
  }

  const template = fs.readFileSync(name, "utf-8");

  // custom template inheritance via yaml front matter.
  // ---
  // extend: 'source-file'
  // replace: !!js/regexp /some-regex/
  // OR
  // replace:
  //   - !!js/regexp /foo/
  //   - !!js/regexp /bar/
  // ---

  const parsed = loadFront(template);
  const content = parsed.__content;

  let finalTemplate = content.trim() + `\n`;

  if (parsed.when) {
    finalTemplate = `<%_ if (${parsed.when}) { _%>` + finalTemplate + `<%_ } _%>`;

    // use ejs.render to test the conditional expression
    // if evaluated to falsy value, return early to avoid extra cost for extend expression
    const result = ejs.render(finalTemplate, data, ejsOptions);
    if (!result) {
      return "";
    }
  }

  if (parsed.extend) {
    const extendPath = path.isAbsolute(parsed.extend)
      ? parsed.extend
      : resolve.sync(parsed.extend, { basedir: path.dirname(name) });

    finalTemplate = fs.readFileSync(extendPath, "utf-8");

    if (parsed.replace) {
      if (Array.isArray(parsed.replace)) {
        const replaceMatch = content.match(replaceBlockReg);

        if (replaceMatch) {
          const replaces = replaceMatch.map((m: string) => {
            return m.replace(replaceBlockReg, "$1").trim();
          });

          parsed.replace.forEach((r: string, i: number) => {
            finalTemplate = finalTemplate.replace(r, replaces[i]);
          });
        }
      } else {
        finalTemplate = finalTemplate.replace(parsed.replace, content.trim());
      }
    }
  }

  return ejs.render(finalTemplate, data, { ...ejsOptions, async: false });
}
