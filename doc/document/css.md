# CSS 相关

Luban 默认支持 `.css` 文件，同时默认支持 [PostCSS](https://postcss.org/)。仅支持一种 CSS 预处理器，即 [Less](http://lesscss.org/)，同时对 Less 文件开启 [CSSModule](https://github.com/css-modules/css-modules) 支持(CSS 文件默认不支持此特性)，支持一种 [css-in-js](https://github.com/MicheleBertoli/css-in-js) 方案 [Styled-components](https://www.styled-components.com/)。具体配置见[luban.config.js](../config/#luban-config-js)。


## PostCSS

无论是否选择 [Less](http://lesscss.org/) 还是 [Styled-components](https://www.styled-components.com/)，Luban 都默认支持 [PostCSS](https://postcss.org/)。可以通过修改 `.postcssrc` 文件或者 `luban.config.js` 文件中的 `css.loaderOptions.postcss` 的选项来配置 PostCSS 的行为。

同时 PostCSS 默认使用了 [autoprefixer](https://github.com/postcss/autoprefixer) 来为 CSS 规则添加特定浏览器厂商前缀。如果要配置目标浏览器，可修改 `.browserslistrc` 文件，更多可查阅 [browserslist](../guide/browser-compatibility.html#browserslist) 。

默认使用了 [postcss-preset-env](https://github.com/csstools/postcss-preset-env) 提供现代 CSS 特性的支持，并自动注入 polyfill，可以在修改 `postcssrc` 文件中的 `postcss-preset-env` 字段来配置此特性。

默认使用了 [cssnano](https://cssnano.co/) 来优化压缩样式代码，可以修改 `postcssrc` 文件中的 `cssnano` 字段来配置此特性。

::: tip 关于 CSS 中浏览器前缀规则的注意事项
在生产环境构建中，Luban 会优化 CSS 并基于目标浏览器抛弃不必要的浏览器前缀规则。因为默认开启了 `autoprefixer`，你只使用无前缀的 CSS 规则即可。
:::

## CSS Modules

仅对 `.less` 文件支持 CSS Module，默认的模块类名为 `[local]-[hash:base64:5]`，可以通过配置 `luban.config.js` 中的 `css.loaderOptions.css` 向 [css-loader](https://github.com/webpack-contrib/css-loader) 传递选项来更改默认的类名以及更改更多的配置选项。

**TODO** ✏️ 如何开启为 css 文件支持 CSS Module?

**TODO** ✏️ 如何关闭为 less 文件默认支持的 CSS Module?

## 向预处理器 Loader 传递选项

有的时候你想要向 webpack 的预处理器 loader 传递选项。你可以使用 `luban.config.js` 中的 `css.loaderOptions` 选项。比如你可以这样向所有 Less 样式传入共享的全局变量：

``` js
// luban.config.js
module.exports = {
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
      postcss: {
        // 这里的选项会传递给 postcss-loader
      },
      miniCss: {
        // 这里的选项会传递给 mini-css-extract-plugin 的 loader
      },
    }
  }
}
```

Loader 可以通过 `loaderOptions` 配置，包括：

- [css-loader](https://github.com/webpack-contrib/css-loader)
- [postcss-loader](https://github.com/postcss/postcss-loader)
- [less-loader](https://github.com/webpack-contrib/less-loader)
- [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

::: tip 提示
这样做比使用 `chainWebpack` 手动指定 loader 更推荐，因为这些选项需要应用在使用了相应 loader 的多个地方。
:::

## 提取 CSS

Luban 对 `.css` 文件还是 `.less` 文件，在开发环境下使用 [style-loader](https://github.com/webpack-contrib/style-loader) 将输出的样式表代码通过 `<style>` 标签内联到文档的头部。

在生产环境下使用 [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) 的 loader 以及 plugin 将样式表代码抽取到一个或几个单独的 CSS 文件中。
