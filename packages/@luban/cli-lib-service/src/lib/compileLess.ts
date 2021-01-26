import less from "less";
import { readFileSync } from "fs";
import path from "path";
import postcss from "postcss";
import autoprefixer from "autoprefixer";

function compileLess(lessFile: string) {
  const resolvedLessFile = path.resolve(process.cwd(), lessFile);

  let data = readFileSync(resolvedLessFile, "utf-8");
  data = data.replace(/^\uFEFF/, "");

  const lessOpts = {
    paths: [path.dirname(resolvedLessFile)],
    filename: resolvedLessFile,
    javascriptEnabled: true,
  };

  return less
    .render(data, lessOpts)
    .then((result) => postcss([autoprefixer]).process(result.css, { from: undefined }))
    .then((r) => r.css);
}

export { compileLess };
