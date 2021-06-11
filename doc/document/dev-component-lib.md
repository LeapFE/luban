# React Component Library

Luban 为开发者提供了一个快速创建基于 React 第三方库的服务，包括但不限于构建、发布和测试等。
+ 文档。内置了一个基于 [docz](https://www.docz.site/) 的文档服务
+ 支持多种模块系统。支持构建 [ESModule](https://262.ecma-international.org/6.0/#sec-modules)、[CommonJS](https://en.wikipedia.org/wiki/CommonJS) 和 [UMD](https://github.com/umdjs/umd) 模块系统
+ 零配置。内置一份合理的工程配置
+ Linter。支持 eslint、stylelint、commitlint 和 prettier 等工具来约束代码
+ 一键发布。内置发布脚本，可一键发布/预发布到 npm

## 如何开发
目录 *components* 是放置组件源码的位置，可以放置一个或者多个组件，这取决于导出这些组件的方式，即在 *components/index.ts* 导出所有组件。

[docz](https://www.docz.site/) 是一款优秀的专为 React 组件书写文档的工具，Luban 使用了它来构建文档系统。

终端运行 `npm run serve` 既可以在本地 3000 端口预览文档：

<img src="https://i.loli.net/2021/06/07/6TanX3F8sZiR1Do.png" alt="image-20210607153432644" style="zoom: 60%;" />

*doczrc.js* 文件是配置文档表现形式的地方，可以配置文档的标题、描述、publicPath 和本地端口等。

查阅 [docz](https://www.docz.site/) 官方文档获得更多信息。

::: tip 代码提交

不同于 Web App 提交代码的方式，Component Library 类型的项目提交代码应该使用 `npm run commit`。

:::



## 如何发布

终端运行 `npm run build` 将会构建产出 ESModule、CommonJs 和 UMD 模块的代码。

终端运行 `npm run test` 将会运行所有单元测试用例，并输出测试报告。

### 预发布

如果要发布一个预发布版本，可以在终端执行：

```shell
npm run release:next
```

执行该脚本将会发布一个带有 **next** 标签的包到 npm 官方仓库，同时在发布前将会运行 `test`，`eslint` 和 `build` 脚本，保障发布的包是通过测试且是新鲜构建的。

随着该脚本的执行，包的版本也会跟着变化，由于指定的是 `prerelease` 版本，所以版本号将会变为 **0.0.2-0**。

::: tip 更改发布源

在 *package.json* 中指定包将会被发布到什么地方：

```json {4}
{
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

更改 `registry` 字段，就可以变更发布源。关于 `publishConfig` 详细配置可以查阅 [publishconfig](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#publishconfig)。

:::

### 发布

终端执行 `npm run release` 将会发布一个正式版本，即带有 `latest` 标签的包，由于默认的脚本内容没有指定发布版本号，当运行该脚本时，需要在终端选择发布的版本：

![image-20210607182247774](https://i.loli.net/2021/06/07/1ZCpTHBbENewcxd.png)

注意选择一个正式发布的版本，即 `patch` 或 `minor` 或 `major`。

这样，就可以通过 npm 安装指定版本包来使用了：

```shell
npm i react-component-lib-demo-brendan@2.0.0
# 或者
npm i react-component-lib-demo-brendan@latest
```

