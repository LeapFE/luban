import { info } from "@luban-cli/cli-shared-utils";
import path from "path";
import fs from "fs-extra";
import webpack = require("webpack");
import nodeExternals from "webpack-node-externals";

function buildDeployFile(outputDir: string) {
  return new Promise<void>((resolve, reject) => {
    const entry = path.join(outputDir, "/server.js");
    webpack(
      {
        mode: "development",
        entry,
        target: "node",
        output: {
          path: outputDir,
          filename: "server.js",
          libraryTarget: "commonjs2",
        },
        optimization: {
          splitChunks: false,
        },
        externals: [nodeExternals({ allowlist: /\.(css|less)$/ })],
      },
      (err) => {
        if (err) {
          console.log(err);
          reject();
          return;
        }

        resolve();
      },
    );
  });
}

export async function buildServerSideDeployFIle(outputDir: string) {
  info("generate server side deploy file");

  const template = fs.readFileSync(outputDir + "/server.ejs", { encoding: "utf-8" });

  fs.writeFileSync(
    outputDir + "/server_template.js",
    `module.exports = ${JSON.stringify(template)}`,
    {
      encoding: "utf-8",
    },
  );
  fs.copyFileSync(path.resolve(__dirname, "../utils/server.js"), outputDir + "/server.js");
  fs.copyFileSync(path.resolve(__dirname, "../utils/server.d.ts"), outputDir + "/server.d.ts");

  await buildDeployFile(outputDir);

  fs.removeSync(outputDir + "/server_template.js");
  fs.removeSync(outputDir + "/server-bundle.js");
  fs.removeSync(outputDir + "/server.ejs");
}
