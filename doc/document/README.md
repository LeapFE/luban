---
sidebarDepth: 0
---

# 介绍

Luban 是一个基于 [React.js](https://reactjs.org/) 的快速创建 React 应用的完整系统。其主要解决三个核心问题：

- 🧲 收敛技术栈、屏蔽底层差异、降低开发和维护成本
- 📏 遵循约定优于配置，提供⼀套规范化的开发模式
- 🔩 基于 [webpack](https://webpack.js.org/) 进⾏封装解决⼯程配置问题

同时提供了以下特性：

- 🐒 工程：开箱即用的工程方案，支持 [ES6](http://www.ecma-international.org/ecma-262/6.0/index.html)+、[TypeScript](http://www.typescriptlang.org)、样式方案（[Styled-Component](https://styled-components.com/)/[Less](http://lesscss.org)/[CSS Modules](https://github.com/css-modules/css-modules)）等
- 🦊 路由：默认使用配置式路由([Luban-Router](https://github.com/leapFE/luban-router#readme))，同时提供权限和导航菜单的解决方案
- 🐯 状态管理：内置集成 [rematch](https://rematch.github.io/rematch/), 基于[redux](https://redux.js.org/) 的数据流方案，对 [TypeScript](http://www.typescriptlang.org) 友好
- 🐦 环境变量配置：通过 [dotenv](https://github.com/motdotla/dotenv)，支持多环境变量的配置
- 🦁 工程配置：零配置，同时提供强大的和可扩展的应用程序配置
- 🐴 Hooks：内置常用工具 hooks, 快速开发组件逻辑
- 🐘 TypeScript：默认使用 [TypeScript](http://www.typescriptlang.org)
- 🦁 Linter: 默认使用 [ESLint](https://eslint.org/) 和 [StyleLint](https://stylelint.io/) 来找出和修复代码中潜在的问题
- 🐅 Unit Test: 使用 [Jest](https://jestjs.io/) 和 [Enzyme](https://enzymejs.github.io/enzyme/) 来测试你的组件

## 该系统的构成

Luban 包括了几个独立的部分。在[源代码](https://github.com/leapFE/luban)仓库中同时管理了多个单独发布的包。

### CLI

CLI (`@luban-cli/cli`) 是一个全局安装的 npm 包，提供了终端里的 `luban` 命令。可以通过 `luban init` 快速创建一个新项目。

### CLI 服务

CLI 服务 (`@luban/cli-plugin-service`) 是一个开发环境依赖。它是一个 npm 包，局部安装在每个
`@luban-cli/cli` 创建的项目中。

CLI 服务是构建于 [webpack](http://webpack.js.org/) 和
[webpack-dev-server](https://github.com/webpack/webpack-dev-server) 之上的。包含了：

- 加载其它 CLI 插件的核心服务
- 一个针对绝大部分应用优化过的内部的 [webpack](http://webpack.js.org/) 配置
- 项目内部的 `luban-cli-service` 命令，提供 `serve`、`build` 和 `inspect` 命令

详细的使用说明见[CLI 服务](./cli-service.md)

### CLI 插件

整个系统采用插件式架构开发。一个插件是一个可以向项目中提供可选特性的包，例如 TypeScript、ESLint 以及单元测试等。

当你使用 `luban init` 命令创建项目时，插件会根据配置写入模板文件、增加配置文件以及扩展 package.json等。当你在本地开发和构建时，插件同时会去修改[webpack](https://webpack.js.org/configuration/) 配置。
