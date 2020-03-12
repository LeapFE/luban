# 创建一个项目

```shell
luban init <project_name>
```

或者使用 `npx @luban-cli/cli init <project_name>` 免安装的方式来创建项目

### `luban init` 命令


在终端运行 `luban init <project_namer>` 命令后，可以通过手动的选择特性来决定项目将会有哪些特性。


手动选择的特性将包括：

- 开发语言 [JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript) /
  [TypeScript](http://www.typescriptlang.org/)
- ESLint 配置选择 [airbnb](https://www.npmjs.com/package/eslint-config-airbnb) /
  [standard](https://www.npmjs.com/package/eslint-config-standard)
- 样式处理方案([Styled-Components](https://styled-components.com/)/[Less](http://lesscss.org/))，默
  认支持 [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS)
- 是否使用路由([Luban-Router](https://www.npmjs.com/package/luban-router))
- 是否使用 [Stylelint](https://stylelint.io/)
- 是否使用状态管理([rematch](https://rematch.github.io/rematch/#/))
- ......

`luban init` 命令将提供一些可选选项，可以运行下面的命令来获取这些选项

```shell
luban init --help
```

```shell
用法：luban init [options] <project_name>

选项：
-m, --manual 跳过默认的 preset，手动选择项目需要的特性
-r, --registry <url> 在安装依赖时使用指定的 npm registry
-n, --no-git 跳过 git 初始化
-f, --force 覆写目标目录可能存在的配置
-h, --help 输出使用帮助信息
-i, --info 输出一些环境信息，比如系统，CPU，Node 版本，Npm 版本
... 更多选项...
```
