## @luban-cli/luban-cli-service
`@luban-cli/luban-cli-service` 是一个开发时运行环境依赖，一个单独的包，局部安装在使用 `@luban-cli/cli` 创建的项目中，提供了：

- 加载其他 CLI 插件的核心服务
- 一份合理的 webpack 配置
- 提供 `luban-cli-service serve` `luban-cli-service build` 等命令

使用 `@luban-cli/cli` 创建的项目中，其中 `package.json` 文件的 `scripts` 字段会增加三个脚本：

```json
{
  "scripts": {
    "serve": "luban-cli-service serve --open",
    "build": "luban-cli-service build",
    "inspect": "luban-cli-service inspect"
  }
}
```

可以通过 npm 或者 yarn 来执行这些 scripts:

```shell
npm run serve
```

#### luban-cli-service serve

``` json
用法：luban-cli-service serve [options]

选项：

  --entry   指定入口文件 (默认值: index.jsx/index.tsx)
  --open    在服务器启动时打开浏览器 (默认值: false)
  --mode    指定环境模式 (默认值: development)
  --host    指定 host (默认值: 0.0.0.0)
  --port    指定 port (默认值: 8080)
  --https   使用 https (默认值: false)
  --public  指定本地开发服务的 publicPath (默认值: "/")
```

该脚本命令会启动一个基于 `webpack-dev-server` 的本地开发服务，并且会附加一些默认的配置和功能。

#### luban-cli-service build

```json
用法：luban-cli-service build [options]

选项：

  --entry    指定入口文件 (默认值: index.jsx/index.tsx)
  --mode     指定环境模式 (默认值: production)
  --dest     指定输出目录 (默认值: dist)
  --report   生成 report.html 以帮助分析包内容
```

该命令会以 [dist] 为默认目录产生一个可以用于生产环境的包，自动的 verdor chunk splitting。其中 chunk mainfest 会内联在 html 文件中。

#### luban-cli-service inspect

> 用来审查特定环境下的 webpack 配置

比如审查 development 环境下的 webpack 配置:

```shell
// 审查 development 环境下的 webpack 配置并输出到 config.txt 文件中
luban-cli-service inspect --mode=development > config.txt
```

审查特定规则/插件的配置:

``` shell
// 审查关于 css 规则的配置
luban-cli-service inspect --rule=css

// 生产 html 插件的配置
luban-cli-service inspect --plugin=html
```

