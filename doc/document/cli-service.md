# CLI 服务

## 使用命令

使用 Luban 创建的项目中，`@luban-cli/luban-cli-service` 会提供 `luban-cli-service` 命令。

你可以在 npm scripts 中以 `luban-cli-service`、或者从终端中以 `./node_modules/.bin/luban-cli-service` 访问这个命令。

同时在 *package.json* 文件的 `scripts` 字段会增加以下几个脚本：

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

可以通过 npm 来执行这些 scripts:

```shell
npm run serve
```

### luban-cli-service serve

```json
用法：luban-cli-service serve [options]

选项：

  --entry   指定入口文件 (默认值: index.jsx/index.tsx)
  --open    在贝蒂服务启动时打开浏览器 (默认值: false)
  --mode    指定环境模式 (默认值: development)
  --host    指定 host (默认值: 0.0.0.0)
  --port    指定 port (默认值: 8080)
  --https   使用 https (默认值: false)
  --public  指定本地开发服务的 publicPath (默认值: "/")
```

该脚本命令会启动一个基于 `webpack-dev-server` 的本地开发服务，并且会附加一些默认的配置和功能。

### luban-cli-service build

```json
用法：luban-cli-service build [options]

选项：

  --entry    指定入口文件 (默认值: index.jsx/index.tsx)
  --mode     指定环境模式 (默认值: production)
  --dest     指定输出目录 (默认值: dist)
  --report   生成 report.html 以帮助分析包内容
```

该命令会以 _dist_ 为默认目录产生一个可以用于生产环境的包，自动的 vendor chunk split。其中 chunk mainfest 会内联在 html 文件中。

### luban-cli-service inspect

> 用来审查特定环境下的 webpack 配置

比如审查 development 环境下的 webpack 配置:

```shell
// 审查 development 环境下的 webpack 配置并输出到 config.txt 文件中
luban-cli-service inspect --mode=development > config.txt
```

审查特定规则/插件的配置:

```shell
// 审查关于 css 规则的配置
luban-cli-service inspect --rule=css

// 生产 html 插件的配置
luban-cli-service inspect --plugin=html
```

## Git Hooks
在创建项目的尾声，Luban 会安装 [husky](https://github.com/typicode/husky) 和 [lint-staged](https://github.com/okonet/lint-staged)
它会让你在 *package.json* 的 `hooks` 字段中方便地指定 [Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)：

```json
{
  "hooks": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "src/**/*.{ts,tsx}": ["npm run eslint", "npm run format:check:ts"],
    "src/**/*.{css,less}": ["npm run stylelint", "npm run format:check:style"]
  }
}
```

## 缓存和并行处理

- ~~`cache-loader` 会默认为 JavaScript/TypeScript 编译开启。文件会缓存在 `node_modules/.cache` 中——如
  果你遇到了编译方面的问题，记得先删掉缓存目录之后再试试看。(UNSUPPORTED TODO)~~

- ~~`thread-loader` 会在多核 CPU 的机器上为 JavaScript/TypeScript 转译开启。(UNSUPPORTED TODO)~~
