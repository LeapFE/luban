/* eslint-disable @typescript-eslint/no-var-requires */
import { StaticRouterContext } from "react-router";
import { ServerBundle } from "../definitions";
import { GenerateDocument } from "./generateDocument";
import { GenerateInjectedTag } from "./generateInjectedHtmlTag";

const generateInjectedTag: GenerateInjectedTag = require("./generateInjectedHtmlTag.js");
const generateDocument: GenerateDocument = require("./generateDocument.js");
const serverBundle: ServerBundle = require("./server-bundle.js");
const template: string = require("./server_template.js");
const assetsManifestJson: Record<string, string> = require("./asset-manifest.json");

interface RenderOptions {
  url?: string;
  path?: string;
  query?: Record<string, string>;
  cachedState?: Record<PropertyKey, unknown>;
  cachedLocation?: Record<PropertyKey, unknown>;
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

  const staticRouterContext: StaticRouterContext = {
    location: { pathname: options.path || "/", ...(options.cachedLocation || {}) },
  };

  const store =
    typeof serverBundle.createStore === "function"
      ? serverBundle.createStore(options.cachedState || {})
      : null;

  const App = await serverBundle.default(context, staticRouterContext, store, options.shared || {});

  const { injectedStyles, injectedScripts } = generateInjectedTag(
    assetsManifestJson,
    options.path || "/",
  );

  const document = generateDocument(template, context, App, injectedScripts, injectedStyles);

  return { document, staticRouterContext };
}
