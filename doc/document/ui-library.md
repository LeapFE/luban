# UI 组件库

在项目中使用一些知名的开源 UI 组件库是比较常见的，比如 [antd](https://ant.design/docs/react/introduce-cn), [antd-mobile](https://mobile.ant.design/index-cn)，但是在使用 [TypeScript](http://www.typescriptlang.org/) 时，添加这些 UI 组件库有些地方将变得不一样，以添加 [antd](https://ant.design/docs/react/introduce-cn) 举例：

## 使用 JavaScript

1. 安装 [antd](https://ant.design/docs/react/introduce-cn) [babel-plugin-import](https://github.com/ant-design/babel-plugin-import)
```bash
npm install antd
```

```bash
npm install babel-plugin-import --save-dev
```

2. 在 *.babelrc* 添加以下配置

```json
{
  // ... 其他配置项
  plugins: [
     // ... 其他的插件
     [
      "import",
      {
        "libraryName": "antd",
        "style": "css"
      },
      "antd"
    ]
  ]
}
```

这样就可以在项目中使用组件了，并且做到了组件和样式的按需自动加载。


## 使用 TypeScript

由于在开发环境使用了 [ts-loader](github.com/TypeStrong/ts-loader) 来处理 *.ts* *.tsx* 文件，所以添加 [antd](https://ant.design/docs/react/introduce-cn) 除了需要上述两个步骤外，还需要另外配置 [ts-loader](github.com/TypeStrong/ts-loader) 的选项：

1. 安装 [ts-import-plugin](https://github.com/Brooooooklyn/ts-import-plugin)
```bash
npm i ts-import-plugin --save-dev
```

2. 在 *luban.config.js* 中添加以下配置
```javascript
// luban.config.js
const tsImportPluginFactory = require("ts-import-plugin");

module.exports = {
  chainWebpack: (webpackConfig) => {
    if (process.env.NODE_ENV === "development") {
      const tsRule = webpackConfig.module.rule("ts");

      tsRule.uses.clear();

      tsRule
        .test(/\.ts[x]?$/)
        .use("ts-loader")
        .loader("ts-loader")
        .options({
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory([
                {
                  libraryName: "antd",
                  libraryDirectory: "lib",
                  style: "css",
                },
              ]),
            ],
          }),
        })
        .end();
    }
  }
};
```

这样就可以在项目中使用组件了，并且做到了组件和样式的按需自动加载。
