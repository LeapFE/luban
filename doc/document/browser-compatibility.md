# 浏览器兼容性

## browserslist

使用 Luban 创建的项目根目录下 *.browserlistrc* 文件，指定了目标浏览器的范围，
这个值会被[@babel/preset-env](https://new.babeljs.io/docs/en/next/babel-preset-env.html) 和
[autoprefixer](https://github.com/postcss/autoprefixer) 以及
[postcss-preset-env](https://github.com/csstools/postcss-preset-env) 用来确定需要转译的 JavaScript
特性和需要添加的 CSS 浏览器厂商前缀以及用于支持现代 CSS 特性的 polyfill。

现在查阅[这里](https://github.com/ai/browserslist)了解如何指定浏览器范围。

## Polyfill

当使用 Babel 来转译 ES/TS 代码时，会默认使用[@babel/preset-env](https://new.babeljs.io/docs/en/next/babel-preset-env.html) 和
[browserlist](https://github.com/ai/browserslist) 来决定项目打包时需求注入哪些 polyfill 代码，来垫平浏览器差异性。
默认的 `@babel/preset-env` 配置项为：

```json
[
  "@babel/preset-env",
  {
    "useBuiltIns": "usage",
    "corejs": {
      "version": 3,
      "proposals": true
    }
  }
]
```

同时将 `@babel/runtime` 作为项目的开发依赖，构建时利用插件 `@babel/plugin-transform-runtime` 来最大化的减小生产环境的包体积。

::: tip 🙋
在使用 TypeScript 作为开发语言，此时在开发环境下将使用 [ts-loader](https://www.npmjs.com/package/ts-loader) 来编译 ts 代码，在生产环境下使用 [babel-loader](https://www.npmjs.com/package/babel-loader) 来编译 ts 代码。这个做法意味着只有在生产环境下才会注入 polyfill 代码。
:::
