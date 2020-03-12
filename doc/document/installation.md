# 安装

::: warning Node 版本要求
Luban 需要 [Node.js](https://nodejs.org/) 10.0 或更高版本。你可以使用
[nvm](https://github.com/creationix/nvm)在同一台电脑中管理多个 Node 版本。
:::

::: warning 操作系统要求 
Luban 目前只在 MacOS 上可以良好运行，在 Window 或者 Linux 上运行 Luban 可能
会发生未知异常。
:::

可以使用下列任一命令安装这个新的包：

```bash
npm install -g @luban-cli/cli
```

::: tip
可以使用淘宝源来稍微加快创建项目的速度 `luban init <project_name>  -r https://registry.npm.taobao.org`

也可以使用 -g [message] 参数强制将项目初始化为一个 git 仓库 `luban init project_name -g`，默认的 git message 为 ​`:rocket: init project`​
:::

安装之后，你就可以在终端中使用 `luban` 命令。你可以通过简单运行 `luban`，看看是否展示出了一份所有可
用命令的帮助信息，来验证它是否安装成功。

你还可以用这个命令来检查其版本是否正确：

```bash
luban --version
```
