# 创建一个 Web App

```shell
luban init <project_name>
```

或者使用 `npx @luban-cli/cli init <project_name>` 免安装的方式来创建项目

::: tip 🙋
可以使用淘宝源来稍微加快创建项目的速度 `luban init <project_name>  -r https://registry.npm.taobao.org`
:::


### `luban init` 命令

在终端运行 `luban init <project_name>` 命令后，选择 **React Web App** :

![image-20210526144501719](https://i.loli.net/2021/05/26/3gBoM2ZzFvY64Sm.png)

选择创建 Web App 类型的项目后，将会以一个默认的预设创建项目，默认的预设如下：

+ [ESLint](https://eslint.org/) 配置方案：<a-radio checked value='leapfe'>[leap](https://www.npmjs.com/package/eslint-config-leapfe)</a-radio><a-radio value='airbnb'>[airbnb](https://www.npmjs.com/package/eslint-config-airbnb)</a-radio><a-radio value='standard'>[standard](https://www.npmjs.com/package/eslint-config-standard)</a-radio></a-radio-group>
+ 使用 <a-checkbox checked>[Stylelint](https://stylelint.io/)</a-checkbox>
+ 使用 <a-checkbox checked>单元测试([Jest](https://jestjs.io/) 和 [Enzyme](https://enzymejs.github.io/enzyme/))</a-checkbox>
+ 使用 <a-checkbox checked>数据获取([Axios](https://github.com/axios/axios) + [use-request](https://www.npmjs.com/package/@luban-hooks/use-request))</a-checkbox>
+ 使用 <a-checkbox checked>[commitizen](https://github.com/commitizen/cz-cli) + [commitlint](https://commitlint.js.org/#/) 提交代码</a-checkbox>

可以加上 `-m` 或 `--manual` 参数，即 `luban init <project_name> -m` 来手动的选择决定项目将会有哪些特性。

手动选择的特性将包括：

- [ESLint](https://eslint.org/) 配置方案 <a-radio value='leapfe'>[leap](https://www.npmjs.com/package/eslint-config-leapfe)</a-radio><a-radio value='airbnb'>[airbnb](https://www.npmjs.com/package/eslint-config-airbnb)</a-radio><a-radio value='standard'>[standard](https://www.npmjs.com/package/eslint-config-standard)</a-radio></a-radio-group>
- 是否使用 <a-checkbox>[Stylelint](https://stylelint.io/)</a-checkbox>
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

### `luban-cli-service` 命令

项目创建完成后，<mark>@luban-cli/cli-plugin-service</mark> 会提供 `luban-cli-service` 命令。

可以在 npm scripts 中以 `luban-cli-service` 或者从终端中以 `./node_modules/.bin/luban-cli-service` 访问这个命令。

同时在 *package.json* 文件的 `scripts` 字段会添加以下几个脚本：

```json
{
  "scripts": {
    "start": "npm run serve",
    "serve": "luban-cli-service serve --open",
    "build": "luban-cli-service build",
    "inspect": "luban-cli-service inspect"
  }
}
```

可以通过 npm 来执行这些 `scripts`:

```shell
npm run serve
```

### luban-cli-service serve

```json
用法：luban-cli-service serve [options]

选项：

  --open    在本地服务启动时打开浏览器 (默认值: false)
  --mode    指定环境模式 (默认值: development)
  --host    指定 host (默认值: 0.0.0.0)
  --port    指定 port (默认值: 8080)
  --https   使用 https (默认值: false)
  --public  指定本地开发服务的 publicPath (默认值: "/")
```

该脚本命令会启动一个基于 ==webpack-dev-server== 的本地开发服务，并且会附加一些默认的配置和功能。

### luban-cli-service build

```json
用法：luban-cli-service build [options]

选项：

  --mode     指定环境模式 (默认值: production)
  --dest     指定输出目录 (默认值: dist)
  --report   生成 report.html 以帮助分析包内容
```

该命令会以 _dist_ 为默认目录产生一个可以用于生产环境的包，自动的 vendor chunk split。

### luban-cli-service inspect

> 用来审查特定环境下的 ==webpack== 配置

```json
用法：luban-cli-service inspect [options]

选项：

  --mode     指定环境模式 (默认值: production)
  --name     指定配置名称, 'client' 或 'server' (默认值: client) 
  --rule <ruleName>     审查指定的模块规则
  --plugin <pluginName> 审查指定的插件
  --rules    列出所有模块规则名称
  --plugins  列出所有插件名称
  --verbose  展示完整的功能定义
```

比如审查 development 环境下的 ==webpack== 配置:

```shell
// 审查 development 环境下的 webpack 配置并输出到 config.txt 文件中
luban-cli-service inspect --mode=development > config.txt
```

开启服务端渲染后，审查服务端侧的 ==webpack== 配置：

```shell
luban-cli-service inspect --mode=development --name=server > config.txt
```

审查特定规则/插件的配置:

```shell
// 审查关于 css 规则的配置
luban-cli-service inspect --rule=css

// 审查 html 插件的配置
luban-cli-service inspect --plugin=html
```
