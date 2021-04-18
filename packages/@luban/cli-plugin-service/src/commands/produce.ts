import path from "path";
import fs from "fs-extra";
import { info } from "@luban-cli/cli-shared-utils";

import { renderFile } from "../utils/serverRender";
import { generateRoutes } from "../utils/generateRoutes";
import { PluginAPI } from "./../lib/PluginAPI";

export async function produceBoilerplate(context: string) {
  info("produce boilerplate files ...");

  const templatePath = path.resolve(__dirname, "../template/boilerplate");

  const targetPath = `${context}/src/.luban`;

  if (fs.existsSync(targetPath)) {
    fs.removeSync(targetPath);
  }

  await fs.copy(templatePath, targetPath);
}

async function produceStore(useStore: boolean, context: string) {
  info("produce store file ...");

  const templatePath = path.resolve(__dirname, "../template/dynamic/store.ts.ejs");

  const targetPath = `${context}/src/.luban/store.ts`;

  if (fs.existsSync(targetPath)) {
    fs.removeSync(targetPath);
  }

  const fileContent = await renderFile(templatePath, { useStore });

  fs.ensureDirSync(path.dirname(targetPath));
  fs.writeFileSync(targetPath, fileContent);
}

async function produceEntry(useStore: boolean, context: string) {
  info("produce client and server entry files ...");

  const clientEntryTemplatePath = path.resolve(
    __dirname,
    "../template/dynamic/client.entry.tsx.ejs",
  );
  const serverEntryTemplatePath = path.resolve(
    __dirname,
    "../template/dynamic/server.entry.tsx.ejs",
  );

  const targetClientEntryPath = `${context}/src/.luban/client.entry.tsx`;
  const targetServerEntryPath = `${context}/src/.luban/server.entry.tsx`;

  if (fs.existsSync(targetClientEntryPath)) {
    fs.removeSync(targetClientEntryPath);
  }

  if (fs.existsSync(targetServerEntryPath)) {
    fs.removeSync(targetServerEntryPath);
  }

  const clientContent = await renderFile(clientEntryTemplatePath, { useStore });

  fs.ensureDirSync(path.dirname(targetClientEntryPath));
  fs.writeFileSync(targetClientEntryPath, clientContent);

  const serverContent = await renderFile(serverEntryTemplatePath, { useStore });

  fs.ensureDirSync(path.dirname(targetServerEntryPath));
  fs.writeFileSync(targetServerEntryPath, serverContent);
}

export async function produceRoutesAndStore(context: string) {
  info("produce route files ...");

  const targetPath = `${context}/src/.luban`;
  const routesFiles: Record<string, string> = { "dynamicRoutes.ts": "", "staticRoutes.ts": "" };

  const { dynamicRouteCode, staticRouteCode, useStore } = await generateRoutes(
    context + "/src/index.tsx",
    context + "/src/route.ts",
  );

  routesFiles["dynamicRoutes.ts"] = dynamicRouteCode;
  routesFiles["staticRoutes.ts"] = staticRouteCode;

  Object.keys(routesFiles).forEach((name) => {
    const _filePath = path.join(targetPath, name);
    fs.ensureDirSync(path.dirname(_filePath));
    fs.writeFileSync(_filePath, routesFiles[name]);
  });

  await produceStore(useStore, context);

  await produceEntry(useStore, context);
}

export default function (api: PluginAPI): void {
  api.registerCommand(
    "produce",
    {
      description: "produce boilerplate",
      usage: "luban-cli-service produce",
    },
    async () => {
      const context = api.getCwd();

      await produceBoilerplate(context);

      await produceRoutesAndStore(context);
    },
  );
}
