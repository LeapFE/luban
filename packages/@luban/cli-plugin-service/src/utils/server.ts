/* eslint-disable @typescript-eslint/no-var-requires */
import { StaticRouterContext } from "react-router";
import ReactDOMServer from "react-dom/server";
import Helmet from "react-helmet";
import ejs from "ejs";
import serialize from "serialize-javascript";

import { ServerBundle } from "../definitions";

const serverBundle: ServerBundle = require("./server-bundle.js");
const template: string = require("./server_template.js");
const assetsManifestJson: Record<string, string> = require("./asset-manifest.json");

function generateInjectedTag(assetsManifest: Record<string, string>, path: string) {
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
}

interface RenderOptions {
  url?: string;
  path?: string;
  query?: Record<string, string>;
  cachedState?: Record<PropertyKey, unknown>;
  shared?: Record<PropertyKey, unknown>;
}

export async function render(options: RenderOptions) {
  const context = {
    url: options.url || "/",
    path: options.path || "/",
    initProps: {},
    initState: {},
    query: options.query || {},
  };

  const staticRouterContext: StaticRouterContext = {};

  const store =
    typeof serverBundle.createStore === "function"
      ? serverBundle.createStore(options.cachedState || {})
      : null;

  const App = await serverBundle.default(context, staticRouterContext, store, options.shared || {});

  const { injectedStyles, injectedScripts } = generateInjectedTag(
    assetsManifestJson,
    options.path || "/",
  );

  let document = "";
  if (App) {
    const content = ReactDOMServer.renderToString(App);

    const helmet = Helmet.renderStatic();

    document = ejs.render(template, {
      CONTENT: content,
      __INITIAL_DATA__: serialize(context.initProps),
      __USE_SSR__: true,
      __INITIAL_STATE__: serialize(context.initState),
      INJECTED_STYLES: injectedStyles,
      INJECTED_SCRIPTS: injectedScripts,
      link: helmet.link.toString(),
      meta: helmet.meta.toString(),
      script: helmet.script.toString(),
      style: helmet.style.toString(),
      title: helmet.title.toString(),
    });
  }

  return { document, staticRouterContext };
}
