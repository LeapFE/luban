# @luban-cli/cli
> 一个快速创建 React 应用的的脚手架，并提供对 TypeScript, ESLint, StyleLint, Styled-Components/Less, UnitTest, StateManager 等特性开箱即用的方案。

### 如何使用

##### 安装

```sh
npm i @luban-cli/cli -g
```

##### 创建一个项目

```shell
luban init <project_name>
```

> 可以使用淘宝源来稍微加快创建项目的速度 `luban init <project_name>  -r https://registry.npm.taobao.org`

> 也可以使用 -g [message] 参数强制将项目初始化为一个 git 仓库 `luban init project_name -g`，默认的 git message 为 ​`:rocket: init project`​

#### luban init 命令

在终端运行 `luban init <project_namer>` 命令后，可以通过手动的选择特性来决定项目将会有哪些特性。

手动选择的特性将包括：

- 是否使用 Babel
- 是否使用 TypeScript
- ~~是否集成 ant UI 组件库 比如 ant-design / ant-mobile~~ 【TODO】
- 是否使用样式处理方案(Styled-Components/Less)，默认支持 Css
- ~~是否集成路由(React-Router)~~ 【TODO】
- 是否使用 ESLint + Prettier
- 是否使用 StyleLint
- ~~是否使用单元测试(jest + enzyme)~~ 【TODO】
- ~~是否集成状态管理~~ 【TODO】
- ......

> ⚠️警告
>
> 5 个特性可以都不选（意味着创建的项目将不会有任何特性，仅仅支持 JavaScript 和 Css），但是选择了 ESLint/Css Pre-Processors/StyleLint 中的任意一个或多个，Babel 和 TypeScript 必须两者之中选一个，否则创建的项目将会启动失败。[TODO]

`luban init` 命令将提供一些可选选项，可以运行下面的命令来获取这些选项

```shell
luban init --help
```

```shell
用法：luban init <project_name> [options]

选项：
-r, --registry <url> 在安装依赖时使用指定的 npm registry
-n, --no-git 跳过 git 初始化
-f, --force 覆写目标目录可能存在的配置
-h, --help 输出使用帮助信息
-g, --git [message] 强制 git 初始化并带有提交 message
-i, --info 输出一些环境信息，比如系统，CPU，Node 版本，Npm 版本
... 更多选项...
```



### CLI 服务

## @luban-cli/cli-plugin-service
`@luban-cli/cli-plugin-service` 是一个开发时运行环境依赖，一个单独的包，局部安装在使用 `@luban-cli/cli` 创建的项目中，提供了：

- 加载其他 CLI 插件的核心服务
- 一份合理的 webpack 配置
- 提供 `@luban-cli/cli-plugin-service serve` `@luban-cli/cli-plugin-service build` 等命令

使用 `@luban-cli/cli` 创建的项目中，其中 `package.json` 文件的 `scripts` 字段会增加三个脚本：

```json
{
  "scripts": {
    "serve": "cli-plugin-service serve --open",
    "build": "cli-plugin-service build",
    "inspect": "cli-plugin-service inspect"
  }
}
```

可以通过 npm 或者 yarn 来执行这些 scripts:

```shell
npm run serve
```

#### cli-plugin-service serve

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

#### cli-plugin-service build

```json
用法：luban-cli-service build [options]

选项：

  --entry    指定入口文件 (默认值: index.jsx/index.tsx)
  --mode     指定环境模式 (默认值: production)
  --dest     指定输出目录 (默认值: dist)
  --report   生成 report.html 以帮助分析包内容
```

该命令会以 [dist] 为默认目录产生一个可以用于生产环境的包，自动的 verdor chunk splitting。其中 chunk mainfest 会内联在 html 文件中。

#### cli-plugin-service inspect

> 用来审查特定环境下的 webpack 配置

比如审查 development 环境下的 webpack 配置:

```shell
// 审查 development 环境下的 webpack 配置并输出到 config.txt 文件中
cli-plugin-service inspect --mode=development > config.txt
```

审查特定规则/插件的配置:

``` shell
// 审查关于 css 规则的配置
cli-plugin-service inspect --rule=css

// 生产 html 插件的配置
cli-plugin-service inspect --plugin=html
```


### 开发相关

#### 浏览器兼容性

##### browserlist

使用 Cli 创建的项目根目录下 `package.json` 文件中的 `browserslist` 字段，指定了目标浏览器的范围，这个值会被 [@babel/preset-env](https://new.babeljs.io/docs/en/next/babel-preset-env.html) 和 [autoprefixer](https://github.com/postcss/autoprefixer) 以及 [postcss-preset-env](https://github.com/csstools/postcss-preset-env) 用来确定需要转译的 JavaScript 特性和需要添加的 Csss 浏览器厂商前缀以及用于支持现代 CSS 特性的 polyfill。

现在查阅[这里](https://github.com/ai/browserslist)了解如何指定浏览器范围。

##### Polyfill

当选择 Babel 来转译 ES 代码时，会默认使用 [@babel/preset-env](https://new.babeljs.io/docs/en/next/babel-preset-env.html) 和 [browserlist](https://github.com/ai/browserslist) 来决定项目打包时需求注入哪些 polyfill 代码，来垫平浏览器差异性。默认的 `@babel/preset-env` 配置项为：

``` 
[
  "@babel/preset-env",
  {
  	"useBuiltIns":"usage",
  	"corejs": {
  		"version":3,
  		"proposals":true
     }
  }
]
```

同时将 `@babel/runtime` 作为项目的生产依赖，利用插件 `@babel/plugin-transform-runtime` 来最大化的减小生产环境的包体积。

> ❗️提示
>
>  在选择了 Babel 和 TypeScript 这两个特性后，默认 useTsWithBabel 为 TRUE，此时在 development 下将使用 `ts-loader` 来编译 ts 代码，在 production 下使用 babel-loader 来编译 ts 代码。这个做法意味着只有在 production 下才会注入 polyfill 代码。另外，在选择了 TypeScript，但是不选 Bebel，将会询问 "Use Babel alongside TypeScript (auto-detected polyfills)?" ，此问题默认为 TRUE，选择 FALSE 后，即 useTsWithBabel 为 FALSE，创建的项目无论在 development 还是 production 下都使用 `ts-loader` 来编译 ts 代码，同时不会注入任何的 polyfill。此时需要手动的在入口文件中引入 `@babel/polyfill`。



#### html 和静态资源

##### HTML

根目录 `template/index.html` 是默认的被 [html-webpack-plugin]() 使用的模板文件，在构建时，会将资源自动注入该文件中。

##### 静态资源(图片/字体/音视频)处理

在 Cli Service 中，通过 `file-loader` 用版本哈希值和正确的公共基础路径来决定最终的文件路径，再用 `url-loader` 将小于 4kb 的资源内联，以减少 HTTP 请求的数量。可以在 `luban.config.js` 中配置 `assetsLimit` 来修改默认的内联文件大小限制。

``` javascript
// luban.config.js
module.exports = {
  // 10kb
  assetsLimit: 10240,
};
```

#### Css 相关

Cli 默认支持 `.css` 文件，同时默认支持 [PostCSS](https://postcss.org/)。仅支持一种 Css 预处理器，即 [Less](http://lesscss.org/)，同时对 Less 文件开启 [CSSModule](https://github.com/css-modules/css-modules) 支持(Css 文件默认不支持此特性)，支持一种 [css-in-js](https://github.com/MicheleBertoli/css-in-js) 方案 [Styled-components](https://www.styled-components.com/)。具体配置见下方[luban.config.js](#lubanconfigjs)。

##### PostCSS

无论是否选择 CSS Pre-Processor，Cli 都默认支持 PostCSS。可以通过修改 `.postcssrc` 文件或者 `luban.confog.js` 文件中的 `css.loaderOptions.postcss` 的选项来配置 PostCSS 行为。

同时 PostCSS 默认使用了 [autoprefixer](https://github.com/postcss/autoprefixer) 来为 CSS 规则添加特定浏览器厂商前缀。

默认使用了 [postcss-preset-env](https://github.com/csstools/postcss-preset-env) 提供现代 CSS 特性的支持，并自动注入 polyfill，可以在修改 `postcssrc` 文件中的 `postcss-preset-env` 字段来配置此特性。

默认使用了 [cssnano](https://cssnano.co/) 来优化压缩样式代码，可以修改 `postcssrc` 文件中的 `cssnano` 字段来配置此特性。

##### CSS Modules

仅对  `.less` 文件支持 CSS Module，默认的模块类名为 `[local]-[hash:base64:5]`，可以通过配置 `luban.config.js` 中的 `css.loaderOptions.css`  向  [css-loader](https://github.com/webpack-contrib/css-loader) 传递选项来更改默认的类名以及更改更多的配置选项。

##### SourceMap 和 HMR

在 development 环境下，对 less-loader, postcss-loader, css-loader 开启 SourceMap 支持，方便样式代码调试。同时开启 HMR 支持样式实时修改预览。



#### Webpack 相关

##### 简单的配置方式

修改 webpack 配置最简单的方式是配置 `luban.config.js` 中的 `configureWebpack` 字段，该字段的类型定义如下：

``` typescript
/**
  * @description webpack 配置
  *
  * 如果这个值是一个对象，则会通过 `webpack-merge` 合并到最终的配置中
  * 如果这个值是一个函数，则会接收被解析的配置作为参数。该函数及可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本
  *
  * @type {Object | Function | undefined}
  */
  configureWebpack?: webpack.Configuration | ((config: webpack.Configuration) => webpack.Configuration | void);
```

>⚠️警告
>
>有些 webpack 选项是基于 `luban.config.js` 中的值设置的，所以不能直接修改。例如你应该修改 `luban.config.js` 中的 `outputDir` 选项而不是修改 `output.path`；你应该修改 `luban.config.js` 中的 `publicPath` 选项而不是修改 `output.publicPath`。这样做是因为 `luban.config.js` 中的值会被用在配置里的多个地方，以确保所有的部分都能正常工作在一起。更多配置见 [luban.config.js](#lubanconfigjs)。

如果你想基于一些环境变量来有条件的进行配置，可以对此字段使用一个函数，函数将会在环境变量设置成功后调用并执行，在函数内部可以直接修改配置或者返回一个已经修改好的配置。

```javascript
// luban.config.js
module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
  }
}
```

##### 链式修改配置

CLI 内部使用了 [webpack-chain](https://github.com/neutrinojs/webpack-chain) 来修改维护 webpack 配置，其允许我们在后期可以细粒度的对 webpack 配置进行修改和审查。在 `luban.config.js` 可以使用 `chainWebpack` 字段来链式的修改 webpack 配置：

```typescript
/**
  * @description 是一个函数，会接收一个基于 `webpack-chain` 的 `Config` 实例
  * 允许对内部的 webpack 配置进行更细粒度的修改
  */
chainWebpack?: (config: Config) => void;
```

修改某一个 loader 的配置:

``` javascript
// luban.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('js')
      .use('babel-loader')
        .loader('babel-loader')
        .tap(options => {
          // 修改它的选项...
          return options
        })
  }
}
```

> ❗️提示
>
> 对于 CSS 相关 loader 来说，我们推荐使用 `css.loaderOptions` 而不是直接链式指定 loader。这是因为每种样式文件类型都有多个规则，而 `css.loaderOptions` 可以确保你通过一个地方影响所有的规则。

添加一个新的 plugin：

``` javascript
// luban.config.js
const PrepackWebpackPlugin = require('prepack-webpack-plugin').default;

module.exports = {
  chainWebpack: config => {
    // https://github.com/gajus/prepack-webpack-plugin
    webpackConfig.plugin("prepack").use(PrepackWebpackPlugin);
  }
}
```

##### 审查 webpack 配置

Cli-srevice 对外暴露了 `inspect` 命令用于审查配置好的 webpack 配置，该命令会将解析好的 webpack 配置，包括通过链式修改的配置打印到 stdout，也可以重定向到一个文件方便查看:

``` shell
cli-plugin-service inspect > config.txt
```

其输出的 webpack 配置并不是一个有效的配置文件，而是一个用于审查的被序列化的格式。

也可以审查特定规则或者插件的配置：

```shell
# 查看 eslint 的配置
cli-plugin-service inspect --rule eslint

# 查看 html-webpacl-plugin 的配置
cli-plugin-service inspect --plugin html
```



#### Linter 相关

由于 [TSLint](https://github.com/palantir/tslint) 官方将在 2019 年底对代码停止维护，所以不论是 js/jsx/ts/tsx 代码都使用 [ESLint](https://github.com/eslint/eslint) 来对代码进行风格校验。对  js/jsx/ts/tsx 代码提供了三种 lint 配置，分别是 basic, standard, airbnb，同时也提供了 [StyleLint](https://github.com/stylelint/stylelint) 来对样式代码进行风格校验。

不论是 eslint 还是 stylelint 报告出的错误都会通过 webpack-dev-server 的 overlay 打印在客户端页面上。其中 ESLint 的报告通过 [eslint-loader](https://github.com/webpack-contrib/eslint-loader) 来输出，StyleLint 的报告通过 [stylelint-webpack-plugin](https://github.com/webpack-contrib/stylelint-webpack-plugin) 来输出。

>在使用 `luban init project_name -g` 创建项目后，若是选择了 eslint， 将会为项目配置 git hook [pre-commit]，运行一些 lint-staged 脚本。

不论是哪种配置的 ESLint，都提供了相应的 [Prettier]([https://prettier.io](https://prettier.io/)) 支持，同时内置了一些 npm scripts 来运行 linter 和 code formatter。

```json
"scripts": {
  "check-type": "tsc --noEmit",
  "eslint": "eslint --ext .tsx,.ts src/",
  "format": "prettier --write src/**/*.{ts,tsx}",
  "check-format": "prettier --check src/**/*.{ts,tsx}",
  "stylelint": "stylelint src/**/*.{less,css}"
},
```



#### 环境变量和模式

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

被载入的环境变量会对 @luban-cli/cli-plugin-service 以及其插件、依赖可用。

> ❗️提示
>
> 对于 dotenv 文件的优先级如下：`.env.[mode].local > .env.[mode] > env.local > .env`

##### 模式

一个 CLI 创建的项目通常有两种模式：

+ `development` 模式被用于 `cli-plugin-service serve`
+ `production` 模式被用于 `cli-plugin-service build`

模式(mode) 不同于 `process.env.NODE_ENV` ，一个模式下可以包含多个环境变量。可以为 `.env` 文件添加模式后缀来指定特定模式下的环境变量，比如在项目根目录下创建 `.env.development` 文件，这个文件就会在 development 模式被载入。

然后可以通过 mode 参数来使用特定模式下的环境变量:

```shell
cli-plugin-service serve --mode development
```

> ❗️提示
>
> `cli-plugin-service server` 会将 `process.env.NODE_ENV` 设置为 `development`, `cli-plugin-service build` 会将 `process.env.NODE_ENV` 设置为 `production`, 建议不要将 `process.env.NODE_ENV` 设置为其他值，因为其他库也可能使用了这个值来区分环境。

**示例：mock 模式**

假设项目根目录下存在一个 .env 文件:

```
APP_URL=https://example.com
```

和 .env.mock 文件

```
MOCK=true
APP_URL=https://example.mock.com
```

1. 运行 `cli-plugin-service build` 将会加载可能存在的 .env, .env.production, .env.production.local 文件，然后根据这些文件中的环境变量来构建可用于生产环境应用。
2. 运行 `cli-plugin-service build --mode=mock` 将会加载可能存在的 .env.mock, .env.mock.local 文件，然后根据这些环境变量来构建可用于生产环境的应用。

这两种情况下，由于运行的是 build 命令，所以都是构建用于生产环境的应用，但是在 mock 模式下，`process.env.APP_URL` 将会被覆写为另外一个值。

同时，只有以 `/^APP_/` 开头的变量才会被 [webpack.DefinePlugin](https://webpack.js.org/plugins/define-plugin/#root) 注入客户端测的代码中，可以在你的应用代码中这样使用环境变量：

```javascript
// 注意 APP_URL 对应的值将会变成 "https://example.mock.com"
console.log(process.env.APP_URL);
```

除了以 `/^APP_/` 开头的环境变量外，还有一些特殊的环境变量也可以在应用中访问到：

+ `NODE_ENV` 将会是 `development` 、 `production` 中的一个。
+ `BASE_URL` 取 `luban.config.js` 配置中的 `publicPath` 选项，即应用部署时的基础路径。


### luban.config.js

根目录下的 `luban.config.js` 应该被下面的 `ProjectConfig` 类型约束。

```typescript
type OptionsOfCssLoader = {
  css: StringDictionary<any>;
  less: StringDictionary<any>;
  postcss: StringDictionary<any>;
  miniCss: StringDictionary<any>;
};

type CssConfig = {
  /**
   * @description 是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)
   * process.env.NODE_ENV === "production"
   *
   * @default false
   */
  extract: boolean;

  /**
   * @description 是否为 CSS 开启 source map
   */
  sourceMap: boolean;

  /**
   * @description 一些处理 css 的 loader 的配置项
   */
  loaderOptions: OptionsOfCssLoader;
};

export type ProjectConfig = {
  /**
   * @description 应用部署时的基本 URL
   * @default "/"
   */
  publicPath: string;

  /**
   * @description 生产环境下应用打包的目录
   */
  outputDir?: string;

  /**
   * @description 放置生成的静态资源(js、css、img、fonts)的目录
   * @default ""
   */
  assetsDir: string;

  /**
   * @description 指定生成的 index.html 文件名或者相对路径
   * @default "index.html"
   */
  indexPath: string;

  /**
   * @description 是否在生成环境下开启 sourceMap
   * @default true
   */
  productionSourceMap: boolean;

  /**
   * @description webpack 配置
   * 如果这个值是一个对象，则会通过 `webpack-merge` 合并到最终的配置中
   * 如果这个值是一个函数，则会接收被解析的配置作为参数。该函数及可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本
   *
   * @type {Object | Function | undefined}
   */
  configureWebpack?: WebpackConfiguration | ((config: WebpackConfiguration) => WebpackConfiguration);

  /**
   * @description 是一个函数，会接收一个基于 `webpack-chain` 的 `Config` 实例
   * 允许对内部的 webpack 配置进行更细粒度的修改
   */
  chainWebpack?: (config: Config) => void;

  /**
   * @description 一些解析 css 的配置选项
   */
  css: CssConfig;

  /**
   * @description webpack-dev-server 的配置项
   */
  devServer: WebpackDevServerConfig;

  /**
   * @description 图片等文件的最大 size
   * @default 4096
   */
  assetsLimit: number;

  /**
   * @description 项目路径映射别名
   */
  alias: StringDictionary<string>;
};
```
