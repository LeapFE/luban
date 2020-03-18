# webpack 相关

## 简单的配置方式

修改 webpack 配置最简单的方式是配置 *luban.config.js* 中的 `configureWebpack` 字段，该字段的类型定义如下：

```typescript
/**
  * @description webpack 配置
  *
  * 如果这个值是一个对象，则会通过 `webpack-merge` 合并到最终的配置中
  * 如果这个值是一个函数，则会接收被解析的配置作为参数。该函数及可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本
  *
  * @type {Object | Function | undefined}
  */
  configureWebpack?: webpack.Configuration | ((config: webpack.Configuration) => webpack.Configuration | void);
```

::: warning
有些 webpack 选项是基于 *luban.config.js* 中的值设置的，所以不能直接修改。例如你应该修改 *luban.config.js* 中的 `outputDir` 选项而不是修改 `output.path`；你应该修改 *luban.config.js* 中的 `publicPath` 选项而不是修改 `output.publicPath`。这样做是因为 *luban.config.js* 中的值会被用在配置里的多个地方，以确保所有的部分都能正常工作在一起。更多配置见 [luban.config.js](../config/#luban-config-js)。
:::

如果你想基于一些环境变量来有条件的进行配置，可以对此字段使用一个函数，函数将会在环境变量设置成功后调用并执行，在函数内部可以直接修改配置或者返回一个已经修改好的配置。

```javascript
// luban.config.js
module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
  },
};
```

## 链式操作

Luban 内部使用了 [webpack-chain](https://github.com/neutrinojs/webpack-chain) 来修改维护 webpack 配置，其允许我们在后期可以细粒度的对 webpack 配置进行修改和审查。在 *luban.config.js* 可以使用 `chainWebpack` 字段来链式的修改 webpack 配置：

```typescript
/**
  * @description 是一个函数，会接收一个基于 `webpack-chain` 的 `Config` 实例
  * 允许对内部的 webpack 配置进行更细粒度的修改
  */
chainWebpack?: (config: Config) => void;
```

修改某一个 loader 的配置:

```javascript
// luban.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule("js")
      .use("babel-loader")
        .loader("babel-loader")
        .tap(options => {
          // 修改它的选项...
          return options
        });
  },
};
```

::: tip 🙋
对于 CSS 相关 loader 来说，我们推荐使用 [css.loaderOptions](../config/#css-loaderoptions) 而不是直接链式指定 loader。这是因为每种 CSS 文件类型都有多个规则，而 `css.loaderOptions` 可以确保你通过一个地方影响所有的规则。
:::

### 添加一个新的 plugin

```javascript
// luban.config.js
const PrepackWebpackPlugin = require("prepack-webpack-plugin").default;

module.exports = {
  chainWebpack: config => {
    // https://github.com/gajus/prepack-webpack-plugin
    webpackConfig.plugin("prepack").use(PrepackWebpackPlugin);
  },
};
```

### 替换一个规则里的 Loader

如果你想要替换一个已有的 loader，例如为内联的 SVG 文件使用 [svg-url-loader](https://www.npmjs.com/package/svg-url-loader) 而不是加载这个 svg 文件：

```javascript
// luban.config.js
module.exports = {
  chainWebpack: config => {
    const svgRule = config.module.rule("svg");

    // 清除已有的所有 loader。
    // Luban 默认使用 [url-loader](https://www.npmjs.com/package/url-loader) 来处理 svg 文件
    // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    svgRule.uses.clear();

    // 添加要替换的 loader
    svgRule
      .test(/\.svg/)
      .use("svg-url-loader")
      .loader("svg-url-loader")
      .options({ /* 传递给 svg-url-loader 的配置选项 */ })
      .end();
  },
}
```

### 修改插件选项

```javascript
// luban.config.js
module.exports = {
  chainWebpack: config => {
    config
      .plugin("html")
      .tap(args => {
        return [/* 传递给 html-webpack-plugin's 构造函数的新参数 */]
      });
  },
};
```

你需要熟悉 [webpack-chain 的 API](https://github.com/mozilla-neutrino/webpack-chain#getting-started) 并[阅读一些源码](https://github.com/leapFE/luban/tree/master/packages/%40luban/cli-plugin-service/src/config)以便了解如何最大程度利用好这个选项，但是比起直接修改 webpack 配置，它的表达能力更强，也更为安全。

比方说你想要将 *index.html* 默认的路径从 */Users/username/proj/public/index.html* 改为 */Users/username/proj/app/templates/index.html*。通过参考 [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin#options) 你能看到一个可以传入的选项列表。我们可以在下列配置中传入一个新的模板路径来改变它：

```javascript
// luban.config.js
module.exports = {
  chainWebpack: config => {
    config
      .plugin("html")
      .tap(args => {
        args[0].template = '/Users/username/proj/app/templates/index.html'
        return args
      });
  },
};
```

你可以通过接下来要讨论的命令 **`luban-cli-service inspect`** 来确认 webpack 配置变更。

## 审查项目的 webpack 配置

因为 `@luban-cli/cli-plugin-service` 对 webpack 配置进行了抽象，所以理解配置中包含的东西会比较困难，尤其是当你打算自行对其调整的时候。

`cli-plugin-service` 暴露了 `inspect` 命令用于审查解析好的 webpack 配置。

该命令会将解析出来的 webpack 配置、包括链式访问规则和插件的提示打印到 stdout。

你可以将其输出重定向到一个文件以便进行查阅：

``` bash
luban-cli-service inspect > output.js
```

注意它输出的并不是一个有效的 webpack 配置文件，而是一个用于审查的被序列化的格式。

你也可以通过指定一个路径来审查配置的一小部分：

``` bash
# 只审查第一条规则
luban-cli-service inspect module.rules.0
```

或者指向一个规则或插件的名字：

``` bash
luban-cli-service inspect --rule ts
luban-cli-service inspect --plugin html
```

最后，你可以列出所有规则和插件的名字：

``` bash
luban-cli-service inspect --rules
luban-cli-service inspect --plugins
```
