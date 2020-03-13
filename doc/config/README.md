---
sidebar: auto
---

# ⚙ 配置参考

## 目标浏览器

请查阅文档中的[浏览器兼容性](../document/browser-compatibility.md#browserslist)章节。

## luban.config.js

*luban.config.js* 是一个可选的配置文件，如果项目的 (和 *package.json* 同级的) 根目录中存在这个文件，
那么它会被 `@luban-cli/cli--plugin-service` 自动识别加载。
具体类型见下方 [配置文件](#配置文件)

这个文件应该导出一个包含了选项的对象：

```javascript
// luban.config.js
module.exports = {
  // 选项...
};
```

### publicPath

- Type: `string`
- Default: `'/'`

  部署应用包时的基本 URL。

  用法和 webpack 本身的 `output.publicPath` 一致，但是 Luban 在一些其他地方也需要用到这个值，所以**请始终使用 `publicPath` 而不要直接修改 webpack 的 `output.publicPath`**。

  默认情况下，Luban 会假设你的应用是被部署在一个域名的根路径上，例如 `https://www.example.com/`。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在
  `https://www.example.com/your-app/`，则设置 `publicPath` 为 `/your-app/`。

  这个值也可以被设置为空字符串 (`''`) 或是相对路径 (`'./'`)，这样所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径。

  这个值在开发环境下同样生效。如果你想把开发服务器架设在根路径，你可以使用一个条件式的值：

  ```javascript
  module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "/your-app-production-sub-path/" : "/",
  };
  ```

### outputDir

- Type: `string`
- Default: `'dist'`

  当运行 `luban-cli-service build` 时生成的生产环境构建文件的目录。注意目标目录在构建之前会被清除。

::: tip 🙋‍♂️
请始终使用 `outputDir` 而不要修改 webpack 的 `output.path`。
:::

### assetsDir

- Type: `string`
- Default: `''`

  放置生成的静态资源 (js、css、img、fonts) 的 (相对于 `outputDir` 的) 目录。

::: tip 🙋‍♂️
从生成的资源覆写 filename 或 chunkFilename 时，`assetsDir` 会被忽略。
:::

### indexPath

- Type: `string`
- Default: `'index.html'`

  指定生成的 `index.html` 的输出路径 (相对于 `outputDir`)。也可以是一个绝对路径。

### productionSourceMap

- Type: `boolean`
- Default: `false`

  如果你需要在生产环境的 source map，可以将其设置为 `true` 来生成 source map 文件。

### configureWebpack

- Type: `Object | Function`

  如果这个值是一个对象，则会通过 [webpack-merge](https://github.com/survivejs/webpack-merge) 合并到最终的配置中。

  如果这个值是一个函数，则会接收被解析的配置作为参数。该函数既可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本。

  更多细节可查阅：[配合 webpack > 简单的配置方式](../document/webpack.md#简单的配置方式)

### chainWebpack

- Type: `Function`

  是一个函数，会接收一个基于 [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain) 的
  `ChainableConfig` 实例。允许对内部的 webpack 配置进行更细粒度的修改。

  更多细节可查阅：[配合 webpack > 链式操作](../document/webpack.md#链式操作-高级)

### css.extract

- Type: `boolean`
- Default: 生产环境下是 `true`，开发环境下是 `false`

  是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)。

  提取 CSS 在开发环境模式下是默认不开启的。你仍然可以将这个值设置为 `true` 在所有情况下都强制提取。

### css.sourceMap

- Type: `boolean`
- Default: 生产环境下是 `false`，开发环境下是 `true`

  是否为 CSS 开启 source map。设置为 `true` 之后可能会影响构建的性能。

### css.loaderOptions

- Type: `Object`
- Default: `{}`

  向 CSS 相关的 loader 传递选项。例如：

  ```javascript
  module.exports = {
    css: {
      loaderOptions: {
        css: {
          // 这里的选项会传递给 css-loader
        },
        postcss: {
          // 这里的选项会传递给 postcss-loader
        },
      },
    },
  };
  ```

  支持的 loader 有：

  - [css-loader](https://github.com/webpack-contrib/css-loader)
  - [postcss-loader](https://github.com/postcss/postcss-loader)
  - [less-loader](https://github.com/webpack-contrib/less-loader)
  - [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

  更多细节可查阅：[向预处理器 Loader 传递选项](../document/css.html#向预处理器-loader-传递选项)

::: tip 🙋‍♂️
相比于使用 `chainWebpack` 手动指定 loader 更推荐上面这样做，因为这些选项需要应用在使用了相应 loader 的多个地方。
:::

### devServer

- Type: `Object`

  所有[`webpack-dev-server` 的选项](https://webpack.js.org/configuration/dev-server/)都支持。注意：

  - 有些值像 `host`、`port` 和 `https` 可能会被命令行参数覆写。

  - 有些值像 `publicPath` 和 `historyApiFallback` 不应该被修改，因为它们需要和开发服务器的[publicPath](#publicPath) 同步以保障本地开发服务的工作。

### devServer.proxy

- Type: `string | Object`

  如果你的前端应用和服务端 API 服务器没有运行在同一个主机上，你需要在开发环境下将 API 请求代理到 API服务器。这个问题可以通过 *luban.config.js* 中的 `devServer.proxy` 选项来配置。

  `devServer.proxy` 可以是一个指向开发环境 API 服务器的字符串：

  ```javascript
  // luban.config.js
  module.exports = {
    devServer: {
      proxy: "http://localhost:4000",
    },
  };
  ```

  这会告诉开发服务器将任何未知请求 (没有匹配到静态文件的请求) 代理到`http://localhost:4000`。

  如果你想要更多的代理控制行为，也可以使用一个 `path: options` 成对的对象。完整的选项可以查阅[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware#proxycontext-config) 。

  ```javascript
  // luban.config.js
  module.exports = {
    devServer: {
      proxy: {
        "/api": {
          target: "<url>",
          ws: true,
          changeOrigin: true,
        },
        "/foo": {
          target: "<other_url>",
        },
      },
    },
  };
  ```

### assetsLimit

- Type: `number`
- Default: `4096`

  图片等媒体文件的最大 size。如果小于这个值将使用 base64 格式内敛到文档中。

### alias

- Type: `Object`
- Default: `{ "@": "<project_name/src>" }`

  使用 `import` 导入模块时的路径别名。用法和 `webpack` 的[`resolve.alias`](https://webpack.js.org/configuration/resolve/#resolvealias) 一致。默认只有 *src* 目录。

::: tip 🙋‍♂
当时使用 TypeScript 为开发语言时，在此处配置别名后，还需要在 *tsconfig.json* 文件中进行同步。更多细节可查阅[这里](http://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)。
:::

## Babel

Babel 可以通过 *babel.config.js* 进行配置。

::: tip 🙋‍♂️
Luban 使用了 Babel 7 中的新配置格式 *babel.config.js*。和 *.babelrc* 或 *package.json* 中的 `babel` 字段不同，这个配置文件不会使用基于文件位置的方案，而是会一致地运用到项目根目录以下的所有
文件，包括 *node_modules* 内部的依赖。
我们推荐在 Luban CLI 项目中始终使用 *babel.config.js* 取代其它格式。
具体请查阅 [Configuration File Types](https://babeljs.io/docs/en/config-files#configuration-file-types) 
:::

同时查阅文档中的 [Polyfill](../document/browser-compatibility.md#polyfill) 章节。

## ESLint

ESLint 可以通过 *.eslintrc* 来配置。

更多细节可查阅文档中的 [代码Linter 和 Prettier](../document/linter.md) 章节。

## StyleLint

StyleLint 可以通过 *.stylelintrc* 来配置。

更多细节可查阅文档中 [代码Linter 和 Prettier](../document/linter.md) 章节。

## TypeScript

TypeScript 可以通过 *tsconfig.json* 来配置。

更多细节可查阅文档中的 [TypeScript](../document/typescript.md) 章节。

## 单元测试

更多细节可查阅文档中的 [UnitTest](../document/unittest.md) 章节。


## 配置文件

默认的 *luban.config.js* 如下：
```javascript
// luban.config.js
module.exports = {
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "",
  indexPath: "index.html",
  productionSourceMap: false,
  css: {
    // 开发环境为 false，生产环境为 true
    extract: undefined,
    // 开发环境为 true，生产环境为 false
    sourceMap: undefined,
    loaderOptions: {
      css: {},
      less: {},
      miniCss: {},
      postcss: {},
    },
  },
  assetsLimit: 4096,
  alias: {
    "@": "<project_path>/src",
  },
};
```

同时 *luban.config.js* 应该被下面的 `ProjectConfig` 类型约束。

```typescript
type OptionsOfCssLoader = {
  css: Record<string, any>;
  less: Record<string, any>;
  postcss: Record<string, any>;
  miniCss: Record<string, any>;
};

type CssConfig = {
  /**
   * @description 是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到文档中的内联样式代码)
   *
   * @default process.env.NODE_ENV === "production"
   */
  extract?: boolean;

  /**
   * @description 是否为 CSS 开启 source map
   *
   * @default process.env.NODE_ENV === "development"
   */
  sourceMap?: boolean;

  /**
   * @description 一些处理 css 的 loader 的配置项
   */
  loaderOptions: OptionsOfCssLoader;
};

export type ProjectConfig = {
  /**
   * @description 应用部署时的基本 URL
   * @default "/"
   */
  publicPath: string;

  /**
   * @description 生产环境下应用打包的目录
   * @default "dist"
   */
  outputDir?: string;

  /**
   * @description 放置生成的静态资源(js、css、img、fonts)的目录
   * @default ""
   */
  assetsDir: string;

  /**
   * @description 指定生成的 index.html 文件名或者相对路径
   * @default "index.html"
   */
  indexPath: string;

  /**
   * @description 是否在生成环境下开启 sourceMap
   * @default false
   */
  productionSourceMap: boolean;

  /**
   * @description webpack 配置
   * 如果这个值是一个对象，则会通过 `webpack-merge` 合并到最终的配置中
   * 如果这个值是一个函数，则会接收被解析的配置作为参数。该函数及可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本
   *
   * @type {Object | Function | undefined}
   */
  configureWebpack?:
    | WebpackConfiguration
    | ((config: WebpackConfiguration) => WebpackConfiguration);

  /**
   * @description 是一个函数，会接收一个基于 `webpack-chain` 的 `Config` 实例
   * 允许对内部的 webpack 配置进行更细粒度的修改
   */
  chainWebpack?: (config: Config) => void;

  /**
   * @description 一些解析 css 的配置选项
   */
  css: CssConfig;

  /**
   * @description webpack-dev-server 的配置项
   */
  devServer: WebpackDevServerConfig;

  /**
   * @description 图片等文件的最大 size
   * @default 4096
   */
  assetsLimit: number;

  /**
   * @description 项目路径映射别名
   */
  alias: Record<string, string>;
};
```
