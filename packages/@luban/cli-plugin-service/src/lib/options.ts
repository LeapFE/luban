import { createSchema, validate } from "@luban-cli/cli-shared-utils";
import defaultsDeep from "lodash.defaultsdeep";

import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";
import { ProjectConfig } from "../main";

const schema = createSchema((joi) =>
  joi.object<ProjectConfig>({
    publicPath: joi.string(),
    outputDir: joi.string(),
    indexPath: joi.string(),
    assetsDir: joi.object({
      scripts: joi.string(),
      styles: joi.string(),
      images: joi.string(),
      media: joi.string(),
      fonts: joi.string(),
    }),
    productionSourceMap: joi.boolean(),
    css: joi.object({
      sourceMap: joi.boolean(),
      loaderOptions: joi.object({
        less: joi.object(),
        css: joi.object(),
        miniCss: joi.object(),
      }),
    }),
    alias: joi.object(),
    assetsLimit: joi.number(),
    mock: joi.boolean(),
    ssr: joi.boolean(),
    configureWebpack: joi.function(),
    chainWebpack: joi.function(),
  }),
);

export function validateProjectConfig(options: unknown, cb?: (msg?: string) => void): void {
  validate(options, schema, { allowUnknown: true }, cb);
}

const defaultsProjectConfig: Partial<ProjectConfig> = {
  publicPath: "/",
  outputDir: "dist",
  assetsDir: {
    scripts: "scripts",
    styles: "styles",
    images: "images",
    fonts: "fonts",
    media: "media",
  },
  indexPath: "index.html",
  templatePath: "index.html",
  productionSourceMap: false,
  assetsLimit: 4096,
  alias: {},
};

export function mergeProjectOptions(
  projectOptions: Partial<ProjectConfig>,
  rootOptions: RootOptions,
): ProjectConfig {
  const isProduction = process.env.NODE_ENV === "production";

  return defaultsDeep(projectOptions, {
    ...defaultsProjectConfig,
    css: {
      sourceMap: !isProduction,
      loaderOptions: {
        css: {},
        less: {},
        miniCss: {},
      },
    },
    mock: rootOptions.fetch || false,
    ssr: false,
    configureWebpack: () => undefined,
    chainWebpack: () => undefined,
  });
}
