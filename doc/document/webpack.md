# webpack 相关

## 简单的配置方式

修改 ==webpack== 配置最简单的方式是配置 *luban.config.ts* 中的 `configureWebpack` 字段，该字段的类型定义如下：

```typescript
/**
 * @description 修改 webpack 配置
 * 这个值是一个函数，接收被解析的配置和配置名称("client" | "server")作为参数
 * 该函数可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本
 * 被解析的配置只包括 ‘module’ 'plugins' 'externals', 同时也只能返回这三个配置项
 *
 * 即通过 `configureWebpack` 只允许修改 ‘module’ 'plugins' 'externals' 这三个配置项
 *
 * **不允许直接返回 `config` 参数**
 *
 * @type {Function | undefined}
 *
 * @default {() => undefined}
 */
configureWebpack: (
  config: WebpackRawConfigCallbackConfiguration,
  id: WebpackConfigName,
) => WebpackRawConfigCallbackConfiguration | void;
```

如果需要基于一些环境变量来有条件的进行配置，可以对此字段使用一个函数，函数将会在环境变量设置成功后调用并执行，在函数内部可以直接修改配置或者返回一个已经修改好的配置。

```ts
// luban.config.ts
import { createProjectConfig } from "@luban-cli/cli-plugin-service";

export default createProjectConfig({
  configureWebpack: (config, name) => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
    
    if (name === "client") {
      // 为客户端侧修改配置
    }
    
    if (name === "server") {
      // 为服务端端侧修改配置(如果开启服务端渲染模式)
    }
  },
});
```

## 链式操作

Luban 内部使用了 [webpack-chain](https://github.com/neutrinojs/webpack-chain) 来修改维护 ==webpack== 配置，其允许我们在后期可以细粒度的对 ==webpack== 配置进行修改和审查。在 *luban.config.ts* 可以使用 `chainWebpack` 字段来链式的修改 ==webpack== 配置：

```typescript
 /**
 * @description 链式修改 webpack 配置
 * 是一个函数，会接收一个基于 `webpack-chain` 的 `Config` 实例和配置名称("client" | "server")作为参数
 * 允许对内部的 webpack 配置进行更细粒度的修改
 *
 * 通过 `chainWebpack` 只允许修改 ‘module’ 'plugins' 'externals' 这三个配置项
 *
 * @default {() => undefined}
 */
chainWebpack: (config: UserConfig, id: WebpackConfigName) => void;
```

修改某一个 loader 的配置:

```ts
// luban.config.ts
import { createProjectConfig } from "@luban-cli/cli-plugin-service";

export default createProjectConfig({
  chainWebpack: (config, name) => {
    config.module
      .rule("ts")
      .use("babel-loader")
        .loader("babel-loader")
        .tap(options => {
          // 修改它的选项...
          return options;
        });
  },
});
```

::: tip 🙋
对于 CSS 相关 loader 来说，我们推荐使用 [`css.loaderOptions`](../config/#css-loaderoptions) 而不是直接链式指定 loader。这是因为每种 CSS 文件类型都有多个规则，而 `css.loaderOptions` 可以确保通过改动一个地方影响所有的规则。
:::

### 添加一个新的 plugin

```ts
// luban.config.ts
import { createProjectConfig } from "@luban-cli/cli-plugin-service";

export default createProjectConfig({
  chainWebpack: (config, name) => {
    if (name === "client") {
      // https://github.com/gajus/prepack-webpack-plugin
      config.plugin("prepack").use(PrepackWebpackPlugin);       
    }
  },
});
```

### 替换一个规则里的 Loader

如果需要替换一个已有的 loader，例如为内联的 SVG 文件使用 [svg-url-loader](https://www.npmjs.com/package/svg-url-loader) 而不是加载这个 svg 文件：

```ts
// luban.config.ts
import { createProjectConfig } from "@luban-cli/cli-plugin-service";

export default createProjectConfig({
  chainWebpack: (config, name) => {
    const svgRule = config.module.rule("svg");

    // 清除已有的所有 loader。
    // Luban 默认使用 [url-loader](https://www.npmjs.com/package/url-loader) 来处理 svg 文件
    // 如果不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    svgRule.uses.clear();

    // 添加要替换的 loader
    svgRule
      .test(/\.svg/)
      .use("svg-url-loader")
      .loader("svg-url-loader")
      .options({ /* 传递给 svg-url-loader 的配置选项 */ })
      .end();
  },
});
```

### 修改插件选项

```ts
// luban.config.ts
import { createProjectConfig } from "@luban-cli/cli-plugin-service";

export default createProjectConfig({
  chainWebpack: config => {
    config
      .plugin("html")
      .tap(args => {
        return [/* 传递给 html-webpack-plugin's 构造函数的新参数 */]
      });
  },
});
```

查阅 [webpack-chain 的 API](https://github.com/mozilla-neutrino/webpack-chain#getting-started) 并[阅读一些源码](https://github.com/leapFE/luban/tree/master/packages/%40luban/cli-plugin-service/src/config)以便了解如何最大程度利用好这个选项，但是比起直接修改 ==webpack== 配置，它的表达能力更强，也更为安全。

比方说需要将 *index.html* 默认的路径从 */home/proj/public/index.html* 改为 */home/proj/app/templates/index.html*。通过参考 [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin#options) 可以看到一个可以传入的选项列表。可以在下列配置中传入一个新的模板路径来改变它：

```ts
// luban.config.ts
import { createProjectConfig } from "@luban-cli/cli-plugin-service";

export default createProjectConfig({
  chainWebpack: config => {
    config
      .plugin("html")
      .tap(args => {
        args[0].template = '/home/proj/app/templates/index.html'
        return args
      });
  },
});
```

可以通过接下来的命令 **`luban-cli-service inspect`** 来确认 ==webpack== 配置变更是否符合预期。

## 审查项目的 webpack 配置

因为 <mark>@luban-cli/cli-plugin-service</mark> 对 ==webpack== 配置进行了抽象，所以理解配置中包含的东西会比较困难，尤其是打算自行对其调整的时候。

==cli-plugin-service== 暴露了 `inspect` 命令用于审查解析好的 ==webpack== 配置。

该命令会将解析出来的 ==webpack== 配置、包括链式访问规则和插件的提示打印到 stdout。

可以将其输出重定向到一个文件以便进行查阅：

``` bash
luban-cli-service inspect > output.js
```

注意它输出的并不是一个有效的 ==webpack== 配置文件，而是一个用于审查的被序列化的格式。

也可以通过指定一个路径来审查配置的一小部分：

``` bash
# 只审查第一条规则
luban-cli-service inspect module.rules.0
```

或者指向一个规则或插件的名字：

``` bash
luban-cli-service inspect --rule ts
luban-cli-service inspect --plugin html
```

审查指定端侧的配置：

```shell
luban-cli-service inspect --name=server
luban-cli-service inspect --name=client
```

最后，可以列出所有规则和插件的名字：

``` bash
luban-cli-service inspect --rules
luban-cli-service inspect --plugins
```

