# 创建一个项目

```shell
luban init <project_name>
```

或者使用 `npx @luban-cli/cli init <project_name>` 免安装的方式来创建项目

::: tip 🙋
可以使用淘宝源来稍微加快创建项目的速度 `luban init <project_name>  -r https://registry.npm.taobao.org`
:::


### `luban init` 命令

在终端运行 `luban init <project_name>` 命令后，将会以默认的 preset 来创建项目。默认的 preset 如下：

+ 开发语言：<a-radio-group value='ts'><a-radio value='ts'>[TypeScript](http://www.typescriptlang.org/)</a-radio><a-radio value='js'>[JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)</a-radio></a-radio-group>
+ [ESLint](https://eslint.org/) 配置方案：<a-radio checked value='leap'>[leap](https://www.npmjs.com/package/eslint-config-leapfe)</a-radio><a-radio value='airbnb'>[airbnb](https://www.npmjs.com/package/eslint-config-airbnb)</a-radio><a-radio value='standard'>[standard](https://www.npmjs.com/package/eslint-config-standard)</a-radio></a-radio-group>
+ 样式处理方案：<a-radio-group value='less'><a-radio checked value='less'>[Less](http://lesscss.org/)</a-radio><a-radio value='sc'>[Styled-Components](https://styled-components.com/)</a-radio></a-radio-group>
+ 使用 <a-checkbox checked>[Stylelint](https://stylelint.io/)</a-checkbox>
+ 使用 <a-checkbox checked>路由([Luban-Router](https://www.npmjs.com/package/luban-router))</a-checkbox>
+ 使用 <a-checkbox checked>单元测试([Jest](https://jestjs.io/) 和 [Enzyme](https://enzymejs.github.io/enzyme/))</a-checkbox>
+ 使用 <a-checkbox checked>数据获取([Axios](https://github.com/axios/axios) + [use-request](https://www.npmjs.com/package/@luban-hooks/use-request))</a-checkbox>
+ 使用 <a-checkbox checked>[commitizen](https://github.com/commitizen/cz-cli) + [commitlint](https://commitlint.js.org/#/) 提交代码</a-checkbox>

可以加上 `-m` 或 `--manual` 参数，即 `luban init <project_name> -m` 来手动的选择决定项目将会有哪些特性。

手动选择的特性将包括：

- 开发语言 <a-radio-group><a-radio value='ts'>[TypeScript](http://www.typescriptlang.org/)</a-radio><a-radio value='js'>[JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)</a-radio></a-radio-group>
- [ESLint](https://eslint.org/) 配置方案 <a-radio value='leap'>[leap](https://www.npmjs.com/package/eslint-config-leapfe)</a-radio><a-radio value='airbnb'>[airbnb](https://www.npmjs.com/package/eslint-config-airbnb)</a-radio><a-radio value='standard'>[standard](https://www.npmjs.com/package/eslint-config-standard)</a-radio></a-radio-group>
- 样式处理方案 <a-radio-group><a-radio value='less'>[Less](http://lesscss.org/)</a-radio><a-radio value='sc'>[Styled-Components](https://styled-components.com/)</a-radio></a-radio-group>
- 是否使用 <a-checkbox>[Stylelint](https://stylelint.io/)</a-checkbox>
- 是否使用 <a-checkbox>路由([Luban-Router](https://www.npmjs.com/package/luban-router))</a-checkbox>
- 是否使用 <a-checkbox>状态管理 ([rematch](https://rematch.github.io/rematch/#/))</a-checkbox>
- 是否使用 <a-checkbox>单元测试([Jest](https://jestjs.io/) 和 [Enzyme](https://enzymejs.github.io/enzyme/))</a-checkbox>
- 是否使用 <a-checkbox>数据获取([Axios](https://github.com/axios/axios) + [use-request](https://www.npmjs.com/package/@luban-hooks/use-request))</a-checkbox>
- 是否使用 <a-checkbox>[commitizen](https://github.com/commitizen/cz-cli) + [commitlint](https://commitlint.js.org/#/) 提交代码</a-checkbox>

`luban init` 命令将提供一些可选选项，可以运行下面的命令来获取这些选项

```shell
luban init --help
```

```shell
用法：luban init [options] <project_name>

选项：
-m, --manual 跳过默认的 preset，手动选择项目需要的特性
-r, --registry <url> 在安装依赖时使用指定的 npm registry
-s, --skipGit 跳过 git 初始化
-f, --force 覆写目标目录可能存在的配置
-g, --git [message] 强制 git 初始化，并带初始的 commit message
-h, --help 输出使用帮助信息
-i, --info 输出一些环境信息，比如系统，CPU，Node 版本，NPM 版本
```
