import { createSchema, validate } from "@luban-cli/cli-shared-utils";
import { ProjectConfig } from "./../definitions";

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
      modules: joi.boolean(),
      extract: joi.boolean(),
      sourceMap: joi.boolean(),
      loaderOptions: joi.object({
        less: joi.object(),
        css: joi.object(),
        miniCss: joi.object(),
        postcss: joi.object(),
      }),
    }),
    devServer: joi.object(),
    alias: joi.object(),
    assetsLimit: joi.number(),
  }),
);

export function validateProjectConfig(options: any): void {
  validate(options, schema, { allowUnknown: true });
}

export const defaultsProjectConfig: ProjectConfig = {
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
  productionSourceMap: false,
  css: {
    extract: undefined,
    sourceMap: undefined,
    loaderOptions: {
      css: {},
      less: {},
      miniCss: {},
      postcss: {},
    },
  },
  assetsLimit: 4096,
  alias: {},
  devServer: {
    /*
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: { "/api": "https://example.com/api" },
    before: app => {}
  */
  },
};
