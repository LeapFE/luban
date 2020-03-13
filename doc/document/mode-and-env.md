# 环境变量和模式

可以在项目根目录中添加以下文件来为项目指定环境变量：

```shell
.env               # 在所有的环境中被载入
.env.local         # 在所有的环境中被载入，但是会被 git 忽略
.env.[mode]        # 在指定的模式下被载入
.env.[mode].local  # 在指定的模式下载入，但是会被 git 忽略
```

一个 dotenv 文件中只可包含环境变量的键值对，例如:

```
FOO=bar
APP_URL=https://example.com/
```

被载入的环境变量会对 `@luban-cli/cli-plugin-service` 以及其插件、依赖可用。

::: tip 环境加载属性

为一个特定模式准备的环境文件 (例如 *.env.production*) 将会比一般的环境文件 (例如 *.env*) 拥有更高的优先级。

此外，Luban 启动时已经存在的环境变量拥有最高优先级，并不会被 *.env* 文件覆写。
:::

::: tip 🙋
对于 dotenv 文件的优先级如下：*.env.[mode].local > .env.[mode] > env.local > .env*
:::

## 模式

一个 CLI 创建的项目通常有两种模式：

+ `development` 模式被用于 `cli-plugin-service serve`
+ `production` 模式被用于 `cli-plugin-service build`

模式(mode) 不同于 `process.env.NODE_ENV` ，一个模式下可以包含多个环境变量。可以为 *.env* 文件添加模式后缀来指定特定模式下的环境变量，比如在项目根目录下创建 *.env.development* 文件，这个文件就会在 development 模式被载入。

然后可以通过 mode 参数来使用特定模式下的环境变量:

```shell
cli-plugin-service serve --mode development
```

::: tip 🙋
`cli-plugin-service server` 会将 `process.env.NODE_ENV` 设置为 `development`, `cli-plugin-service build` 会将 `process.env.NODE_ENV` 设置为 `production`, 建议不要将 `process.env.NODE_ENV` 设置为其他值，因为其他库也可能使用了这个值来区分环境。
:::

**示例：mock 模式**

假设项目根目录下存在一个 *.env* 文件:

```
APP_URL=https://example.com
```

和 *.env.mock* 文件

```
MOCK=true
APP_URL=https://example.mock.com
```

1. 运行 `cli-plugin-service build` 将会加载可能存在的 *.env*, *.env.production*, *.env.production.local* 文件，然后根据这些文件中的环境变量来构建可用于生产环境应用。
2. 运行 `cli-plugin-service build --mode=mock` 将会加载可能存在的 *.env.mock*, *.env.mock.local* 文件，然后根据这些环境变量来构建可用于生产环境的应用。

这两种情况下，由于运行的是 build 命令，所以都是构建用于生产环境的应用，但是在 mock 模式下，`process.env.APP_URL` 将会被覆写为另外一个值。

同时，只有以 `/^APP_/` 开头的变量才会被 [webpack.DefinePlugin](https://webpack.js.org/plugins/define-plugin/#root) 注入客户端测的代码中，可以在你的应用代码中这样使用环境变量：

```javascript
// 注意 APP_URL 对应的值将会变成 "https://example.mock.com"
console.log(process.env.APP_URL);
```

除了以 `/^APP_/` 开头的环境变量外，还有一些特殊的环境变量也可以在应用中访问到：

+ `NODE_ENV` 将会是 `development` 、 `production` 中的一个。
+ `BASE_URL` 取 `luban.config.js` 配置中的 `publicPath` 选项，即应用部署时的基础路径。

## 只在本地有效的变量

有的时候你可能有一些不应该提交到代码仓库中的变量，尤其是当你的项目托管在公共仓库时。这种情况下你应该使用一个 *.env.local* 文件取而代之。本地环境文件默认会被忽略，且出现在 *.gitignore* 文件中。

*.local* 也可以加在指定模式的环境文件上，比如 *.env.development.local* 将会在 development 模式下被载入，且被 git 忽略。
