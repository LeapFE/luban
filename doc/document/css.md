# CSS 相关

Luban 默认支持 *.css* 文件，同时默认支持 [PostCSS](https://postcss.org/)。仅支持一种 CSS 预处理器，即 [Less](http://lesscss.org/)，同时对 *.less* 文件开启 [CSSModule](https://github.com/css-modules/css-modules) 支持(*.css* 文件默认不支持此特性)。具体配置见[luban.config.js](../config/#luban-config-ts)。

::: tip 🙋
基于 React 的样式方案社区存在着很多的技术方案，上面提到的 CSS Modules 也是 css-in-js 的一种。更多查阅 [StateOfCSS](https://2019.stateofcss.com/technologies/tools-overview/)
:::


## PostCSS

无论是 [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) 还是 [Less](http://lesscss.org/)，Luban 都默认支持 [PostCSS](https://postcss.org/)。可以通过修改 *postcss.config.js* 文件来配置 PostCSS 的行为。

同时 PostCSS 默认使用了 [autoprefixer](https://github.com/postcss/autoprefixer) 来为样式表规则添加特定浏览器厂商前缀。如果要配置目标浏览器，可修改 *.browserslistrc* 文件，更多可查阅 [browserslist](../guide/browser-compatibility.html#browserslist) 。

默认使用了 [postcss-preset-env](https://github.com/csstools/postcss-preset-env) 提供[现代 CSS](https://cssnext.github.io/) 特性的支持，并自动注入 polyfill，可以在修改 *.postcssrc* 文件中的 `postcss-preset-env` 字段来配置此特性。

默认使用了 [cssnano](https://cssnano.co/) 来优化压缩样式代码，可以修改 *.postcssrc* 文件中的 `cssnano` 字段来配置此特性。

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
