# HTML 和静态资源

## HTML

### 模板文件

根目录 *template/index.html* 是默认的被 [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) 使用的模板文件，在构建时，会将资源路径自动注入该文件中。

### 使用插值

文件 *template/index.html* 只是被用作模板文件，所有可以使用 [EJS 模板标签语法](https://ejs.bootcss.com/#docs) 向文档中插入变量：

+ `<%= VALUE %>` 用来做不转义插值
+ `<%- VALUE %>` 用来做 HTML 转义插值
+ `<% expression %>` 用来描述 JavaScript 流程控制

可以使用被注入的[客户端环境变量](mode-and-env.md)，也可以使用被 [html-webpack-plugin 默认注入的变量](https://github.com/jantimon/html-webpack-plugin#writing-your-own-templates)。

比如使用 `BASE_URL`:
``` html
<link rel="icon" type="image/x-icon" href="<%= BASE_URL %>favicon.ico">
```

关于 `BASE_URL` 查阅 [publicPath](../config/README.md#publicpath)

### Preload/Prefetch

默认情况下，在构建生产环境的应用时，`luban-cli-service` 会对所有应用初始加载时需要的 JavaScript/CSS 文件生成 [preload](https://www.w3.org/TR/preload/) [resource hint](https://www.w3.org/TR/resource-hints/)，对 async chunk 生成的 JavaScript/CSS 文件(通过动态 [import() 以及 code splitting](https://webpack.js.org/guides/code-splitting/#dynamic-imports) 生成的代码块)生成 [prefetch](https://www.w3.org/TR/resource-hints/#prefetch) [resource hint](https://www.w3.org/TR/resource-hints/)，
同时这些 hint 会被 [preload-webpack-plugin](https://github.com/googlechromelabs/preload-webpack-plugin) 注入到生成的 `index.html` 文件中。

可以通过 `chainWebpack` 的 `webpackConfig.plugin("preload")` 或者 `webpackConfig.plugin("prefetch")` 进行修改和删除:

```ts
// luban.config.ts
import { createProjectConfig } from "@luban-cli/cli-plugin-service";

export default createProjectConfig({
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete("prefetch");

    // 或者修改它的选项：
    config.plugin("prefetch").tap(options => {
      options[0].fileBlacklist = options[0].fileBlacklist || [];
      options[0].fileBlacklist.push(/my_async_component(.)+?\.js$/);
      return options
    })
  },
});
```

## 处理静态资源

静态资源可以通过以下两种方式被使用：
+ 在 *js/ts/jsx/tsx* 或者 *css/less/sass* 文件中通过相对路径被引用。这类资源会被 ==webpack== 接管处理。
+ 放置在 *public* 目录下的或者通过绝对路径被引用，比如 cdn。这类资源会被直接拷贝，不会被 ==webpack== 处理。

### 从相对路径导入
在 *js/ts/jsx/tsx* 或者 *css/less/sass* 文件中使用相对路径(以 `.` 开头)引用一个静态资源时，该资源会被 ==webpack== 接管处理，包含进 ==webpack== 的依赖图中，在其编译过程中，所有诸如 `import Image from "..."`、`background: url(...)` 和 CSS `@import` 的资源 URL 都会被解析为一个模块依赖。例如：

在 *js/ts/jsx/tsx* 使用图片:
``` ts
import SomeImage from "./../../assets/some-image.png";
```
在 *css/less/sass* 使用图片:
``` less
.logo {
  background: url(./../../assets/logo.png);
}
```

::: tip 🙋
在最新版本的 file-loader 中默认是不支持通过 `require(...)` 来引用图片的。更多查阅 [file-loader](https://www.npmjs.com/package/file-loader#esmodule)。
:::

### URL 解析规则

+ 如果 URL 是一个绝对路径(以 `/` 开头)，例如 */images/foo.png*，URL 将会被保留不变。

+ 如果 URL 以 `.` 开头，它会作为一个相对模块请求被解析且基于项目的文件系统中的上下文目录进行解析，最后产生模块的绝对路径。

+ 如果 URL 以 `~` 开头，其后的任何内容都会作为一个模块请求被解析。这意味着甚至可以引用 Node 模块中的资源：
```typescript
import SomeImage from "~some-package/some-image.png";
```

+ 如果 URL 以 `@` 开头，它也会作为一个模块请求被解析。它的用处在于默认会设置一个指向 *projectRoot/src* 的别名 `@`(路径别名)。

更多信息查阅 [module-resolution](https://webpack.js.org/concepts/module-resolution/#resolving-rules-in-webpack)。

### Base64 编译

在 ==cli-plugin-service== 中，通过 ==file-loader== 用版本哈希值和正确的公共基础路径来决定最终的文件路径，再用 ==url-loader== 将小于 4kb 的资源内联，以减少 HTTP 请求的数量。可以在 *luban.config.ts* 中配置 `assetsLimit` 来修改默认的内联文件大小限制：

```ts
// luban.config.ts
import { createProjectConfig } from "@luban-cli/cli-plugin-service";

export default createProjectConfig({
  // 10kb
  assetsLimit: 10240,
});
```
