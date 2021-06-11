# 构建和部署

大多数前端应用都是独立于服务端进行部署，即服务端只提供一个可访问的接口服务，此时前端应用实际上是一个静态应用。所以可以将构建后的 *dist* 目录中的文件放置到静态服务器上即可，且保证 [publicPath](../config/README.md#publicpath) 正确的。

## 指定目标构建环境

有时候项目在正式发布到线上之前，常常会在测试、预发布、灰度等环境进行一系列验证测试。项目根目录下会有默认的 *.env*、*.env.development*、*.env.production* 三个指定环境变量的文件，对应开发和生产环境(*.env* 是对所有环境都可以使用的文件)。同时在 *package.json* 文件的 `scripts` 字段添加了构建脚本命令：

```json
{
  "scrips": {
    "build": "luban-cli-service build"
  }
}
```

在终端运行这条命令 `npm run build`，将会读取 *.env.production*，构建一个可用于生产环境的包。

同样的，也可以指定一个用于构建测试环境的包，只需要新建一个 `.env.test` 的文件，然后在 *package.json* 文件的 `scripts` 字段添加脚本：

```json {4}
{
  "scrips": {
    "build": "luban-cli-service build",
    "build:test": "luban-cli-service build --mode=test"
  }
}
```

然后在终端运行 `npm run build:test`，将会读取 *.env.test* 中指定的环境变量，构建一个可用于测试环境的包。

::: tip 🙋
注意这里的 `mode` 要与 dotenv 的后缀保持一致，以保证 ==cli-plugin-service== 可以读取并注入正确的环境变量。
:::

更多查阅 [环境变量和模式](mode-and-env.md)

## 构建产物

运行 `npm run build` 后，会产生一个 *dist* 目录，包含了所有的构建产物：JavaScript 文件、CSS 文件、图片和媒体资源等。具体对应目录如下：

+ 脚本文件放在 ***scripts*** 目录下
+ 样式文件放在 ***styles*** 目录下
+ 图片放在 ***images*** 目录下
+ 字体文件放在 ***fonts*** 目录下
+ 媒体文件放在 ***media*** 目录下

可以 *luban.config.ts* 中配置这些文件输出行为，具体查阅 [配置](../config/#luban-config-ts)。

::: tip 🙋
当尝试修改图片的输出路径时，要确保在 CSS 文件中访问图片的路径是正确的，具体见 [file-loader](https://www.npmjs.com/package/file-loader#publicpath)。
:::

## 本地预览

生成的 *dist* 目录需要启动一个本地 HTTP 服务来访问(本地通过 HTTP 服务来访问需要保证 publicPath 正确，保证其他静态资源可以访问到)。可以安装 [http-server](https://github.com/http-party/http-server#readme) 或者 [serve](https://github.com/zeit/serve#readme):
```shell
npm i http-server -g
```

然后进入 *dist* 目录运行：
```shell
http-server
```

按照终端中提示的访问地址，就可以在浏览器中进行预览了。
