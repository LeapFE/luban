# CSS 相关

Luban 默认支持 *.css* 文件，同时默认支持 [PostCSS](https://postcss.org/)。仅支持一种 CSS 预处理器，即 [Less](http://lesscss.org/)，同时对 *.less* 文件开启 [CSSModule](https://github.com/css-modules/css-modules) 支持(*.css* 文件默认不支持此特性)。具体配置见[luban.config.js](../config/#luban-config-ts)。

::: tip 🙋
基于 React 的样式方案社区存在着很多的技术方案，上面提到的 CSS Modules 也是 css-in-js 的一种。更多查阅 [StateOfCSS](https://2019.stateofcss.com/technologies/tools-overview/)
:::


## PostCSS

无论是 [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) 还是 [Less](http://lesscss.org/)，Luban 都默认支持 [PostCSS](https://postcss.org/)。可以通过修改 *postcss.config.js* 文件来配置 PostCSS 的行为。

同时 PostCSS 默认使用了 [autoprefixer](https://github.com/postcss/autoprefixer) 来为样式表规则添加特定浏览器厂商前缀。如果要配置目标浏览器，可修改 *.browserslistrc* 文件，更多可查阅 [browserslist](../guide/browser-compatibility.html#browserslist) 。

默认使用了 [postcss-preset-env](https://github.com/csstools/postcss-preset-env) 提供[现代 CSS](https://cssnext.github.io/) 特性的支持，并自动注入 polyfill，可以在修改 *postcss.config.js* 文件中的 `postcss-preset-env` 字段来配置此特性。

默认使用了 [cssnano](https://cssnano.co/) 来优化压缩样式代码，可以修改 *postcss.config.js* 文件中的 `cssnano` 字段来配置此特性。

::: tip 关于 CSS 中浏览器前缀规则的注意事项 
在生产环境构建中，Luban 会优化 CSS 并基于目标浏览器抛弃不必要的浏览器前缀规则。因为默认开启了 ==autoprefixer==，只需使用无前缀的 CSS 规则即可。
:::

## CSS Modules

仅对 *.less* 文件支持 [CSS Module](https://github.com/css-modules/css-modules)，==css-loader== 的 `modules` 默认的配置为：
```js
{
  mode: "global",
  exportGlobals: true,
  localIdentName: "[name]__[local]__[hash:base64:5]",
}
```

这个配置意味着可以像这样书写和使用样式：
``` less
// index.less
:local(.wrapper) {
  display: inline-flex;

  .container {
    font-size: 16px;
  }
}

:global {
  .global-style {
    font-size: 12px;
  }
}
```

然后：

```ts
import styles from "./index.less";

const SomeComponent = () => {
  return (
    <div className={styles.wrapper}>
      <div className="container">some text</div>
    </div>
  );
};

```

这样就可以创建一个 scope 的样式作用域，而不必所有类名都通过 `styles` 来访问。

## 向预处理器 Loader 传递选项

有的时候需要向 ==webpack== 的预处理器 loader 传递选项。可以使用 *luban.config.ts* 中的 `css.loaderOptions` 选项。比如可以这样向所有 Less 样式传入共享的全局变量：

```ts
// luban.config.ts
import { createProjectConfig } from "@luban-cli/cli-plugin-service";

export default createProjectConfig({
  css: {
    loaderOptions: {
      // 给 less-loader 传递 Less.js 相关选项
      less:{
        // http://lesscss.org/usage/#less-options-strict-units `Global Variables`
        // `primary` is global variables fields name
        globalVars: {
          primary: '#fff'
        }
      },
      css: {
        // 这里的选项会传递给 css-loader
      },
      miniCss: {
        // 这里的选项会传递给 mini-css-extract-plugin 的 loader
      },
    }
  }
});
```

Loader 可以通过 `loaderOptions` 配置，包括：

- [css-loader](https://www.npmjs.com/package/css-loader/v/3.4.0)
- [less-loader](https://www.npmjs.com/package/less-loader/v/5.0.0)
- [mini-css-extract-plugin](https://www.npmjs.com/package/mini-css-extract-plugin/v/1.4.1#publicPath)

::: tip 🙋
这样做比使用 [`chainWebpack`](webpack.md#链式操作) 手动指定 loader 更推荐，因为这些选项需要应用在使用了相应 loader 的多个地方。
:::
