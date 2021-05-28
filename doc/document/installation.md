# 安装

::: warning ⚠️ Node 版本要求
Luban 需要 [Node.js](https://nodejs.org/) 10.0 或更高版本。你可以使用
[nvm](https://github.com/creationix/nvm)在操作系统中管理多个 Node 版本。
:::

::: warning ⚠️ 操作系统要求 
Luban 目前只在 MacOS 和 Linux 等类 Unix 操作系统上可以良好运行，在 Windows 操作系统运行 Luban 可能会发生未知异常。
:::

::: warning ⚠️ 包管理工具要求
Luban 目前只支持 NPM 官方的包管理工具 [npm](https://docs.npmjs.com)，并不支持 [yarn](https://yarnpkg.com/)、[bower](https://bower.io/) 等包管理工具。
:::

可以使用以下命令安装 Luban：

```bash
npm install -g @luban-cli/cli
```

安装之后，就可以在终端中使用 `luban` 命令。可以通过简单运行 `luban`，查看是否展示出了一份所有可用命令的帮助信息，来验证它是否安装成功。

也可以使用以下命令来检查其版本是否正确：

```bash
luban --version
```

之后，就可以创建项目了：[创建Web App](/document/create-web-app.md) 或者 [创建Component Library](/document/create-component-lib.md)