# 服务端渲染

Luban 提供的服务端渲染可以有效减少第一字节内容到达时间([TTFB](https://developer.mozilla.org/zh-CN/docs/Glossary/time_to_first_byte))，即白屏时间和提高[SEO](https://developer.mozilla.org/zh-CN/docs/Glossary/SEO)能力。且具有以下特性：

🍌 开箱即用。可一键开启，本地可同时调式客户端渲染和服务端渲染

🥦 服务端框架无关。可以使用[Koa](https://eggjs.org/), [Express](https://expressjs.com/),[Egg.js](https://eggjs.org/)等服务端框架简单集成

🌽 数据预取和状态。支持在全局和路由组件获取数据和访问状态

🧅 动态加载。支持动态加载客户端静态文件

## 是否真的需要服务端渲染

与 SPA (单页应用程序 (Single-Page Application)) 相比，服务器端渲染具有以下两个大的优势：

- 更好的 SEO，搜索引擎和爬虫抓取工具可以直接查看完全渲染的页面。

- 更快的 TTFB，特别是对于缓慢的网络情况或运行缓慢的设备。无需等待所有的 JavaScript 都完成下载并执行，才显示服务器渲染的标记，所以用户将会更快速地看到完整渲染的页面。可以产生更好的用户体验，特别是那些对转化率要求较高的应用而言，服务器端渲染至关重要。

当然服务端渲染不是万能的，也要考虑以下问题：

- 开发条件限制。浏览器特定 API，只能在某些生命周期函数中使用；一些第三方库可能需要特殊处理，才能在服务端渲染模式下正常运行。

- 构建和部署的更多要求。与单页应用直接部署静态文件不同，服务端渲染应用本质是一个 Nodejs 应用程序，需要一个 Nodejs 完整运行环境。部署时需要考虑诸如缓存策略、负载、高可用等等服务端应用程序需要考虑的问题。

在开启服务端渲染模式之前，应该认真考虑是否真的需要服务端渲染。这取决于应用程序是否对 TTFB 有着非常高的诉求。例如一些内部使用的管理系统、营销系统等等，对初始加载时间并不敏感，这种情况下开启服务端渲染显然是得不偿失的。然而，对 TTFB 敏感的应用，服务器端渲染可以实现最佳的初始加载时间。

## 开启服务端渲染

在配置文件 _luban.config.ts_ 中可以一键开启服务端渲染模式：

```ts{6}
// luban.config.ts
import { createProjectConfig } from "@luban-cli/cli-plugin-service";

export default createProjectConfig({
  publicPath: process.env.APP_PUBLIC_PATH,
  ssr: true,
});
```

开启后，本地服务将自动重启，默认打开 http://localhost:3000 来预览服务端渲染的页面，可以在页面右键点击 '查看网页源代码' 来确认服务端渲染模式是否生效。

## 数据初始获取

开启服务端渲染之后，就可以在路由组件的 `getInitialProps` 方法中预获取数据：

```tsx
import React from "react";
import { EnhancedRouteComponentProps, Page } from "@/.luban";
import { UserItem } from "@/service/interface/user";
import { getUserList } from "@/service/api/user";

interface DemoInitialProps {
  users: UserItem[];
}

const Demo: Page<EnhancedRouteComponentProps, DemoInitialProps> = ({ users }) => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

Demo.getInitialProps = () => {
  return getUserList({})
    .then((res) => {
      if (res.status === 200 && res.data.code === 1) {
        return { users: res.data.data };
      }

      return { users: [] };
    })
    .catch(() => {
      return { users: [] };
    });
};

export default Demo;
```

上面这个列子在 `getInitialProps` 方法中将从接口获取的数据 `users` 注入到 `Demo` 组件的 `props` 上，这样就可以在 `Demo` 组件中消费 `users` 了。需要注意的是，在向组件 `props` 上注入数据时，首先需要声明初始数据的类型，即 `DemoInitialProps`，并将其作为 `Page` 的第二个泛型参数，这样可以很好的约束`getInitialProps` 方法的返回值类型。**另外当在 `getInitialProps` 函数中调用 Promise 函时必须捕获 Promise 链中出现的异常，以避免程序出现假死的情况。**

### `getInitialProps`

上面例子中提到的 `getInitialProps` 赋予了路由组件可以在服务端侧获取数据的能力，同时在该函数中也可以获取请求路径、参数等：

```ts
Demo.getInitialProps = (context) => {
  // 请求 path
  console.log(context.path);
  // 请求 URL
  console.log(context.url);
  // 请求 params
  console.log(context.params);
  // 请求 query
  console.log(context.query);

  return {};
};
```

该函数的可以返回一个 Promise 也可以直接返回一个值：

```ts
Demo.getInitialProps = (context) => {
  // 返回一个 Promise
  return Promise.resolve({ users: [] });

  // 返回一个 Promise
  return new Promise((resolve) => {
    resolve({ users: [] });
  });

  // 返回一个值
  return { users: [] }
};
```

### 访问和更新全局状态
在 *src/index.tsx* 文件中开启全局状态管理后，就可以在 `getInitialProps` 函数中消费和更新全局状态了，依然以获取数据 `users` 举例：
```tsx
import React from "react";
import { EnhancedRouteComponentProps, Page } from "@/.luban";

import { useSelector } from "react-redux";
import { RootState } from "@/models";

const Demo: Page<EnhancedRouteComponentProps> = ({ name }) => {
  const user = useSelector((s: RootState) => s.user);
  return (
    <ul>
      {user.users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

Demo.getInitialProps = async (context) => {
  await context.store.dispatch.user.getUserList();

  return Promise.resolve();
};

export default Demo;
```

上面这个例子，首先需要配置一个名叫 `user` 的 model，查阅[启动状态管理](/document/store.md#启用状态管理)了解如何添加 model。

之后便可以在 `context` 对象上访问 `store` 对象。然后组件中连接 `store` 并更新和消费状态。

## 页面 meta 标签
在有 SEO 需求的情况下，需要向页面动态设置 meta 标签或者其他的标签，首先需要安装 [react-helmet](https://github.com/nfl/react-helmet):
```shell
npm install react-helmet@6.1.0
npm install @types/react-helmet@6.1.1 --save-dev
```

在某一个路由组件中：
```ts{3,8,9,10,11,12,13,14,15,16}
import React from "react";
import { EnhancedRouteComponentProps, Page } from "@/.luban";
import { Helmet } from "react-helmet";

const Demo: Page<EnhancedRouteComponentProps> = ({ name }) => {
  return (
    <div>
      <Helmet>
        <title>{name}</title>
        <meta name="description" content="A description" />
        <style>
          {
            "html, body { width: 100%; height: 100%;}"
          }
        </style>
      </Helmet>
    </div>
  );
};

export default Demo;
```

## 构建和部署
### 构建
在终端执行 `npm run build` 之后，会看到 *dist* 目录下产生了一个 *server.js* (*server.d.ts* 是该文件的类型声明文件) 的文件:
```shell {10,11}
dist
  ├── asset-manifest.json
  ├── index.html
  ├── scripts
  │   ├── client-b75d14c9.chunk.js
  │   ├── page-next-b75d14c9.chunk.js
  │   ├── page-prev-b75d14c9.chunk.js
  │   ├── runtime-b75d14c9.js
  │   └── vendors-b75d14c9.chunk.js
  ├── server.d.ts
  ├── server.js
  └── styles
      ├── client-b75d14c9.chunk.css
      ├── page-next-b75d14c9.chunk.css
      └── page-prev-b75d14c9.chunk.css
```

以 ==Express== 举例，新建 `start.js`：
```js
const express = require("express");
const { render } = require("./dist/server");

const app = express();

app.use("/assets/", express.static("dist"));

app.use(async (req, res) => {
  try {
    const { document } = await render({ path: req.path });

    res.send(document);
  } catch (e) {
    console.log(e);
    res.send(`something wrong ${e}`);
  }
});

app.listen(3000, () => {
  console.log("server listening up at: 3000");
});
```

终端运行 `node start.js`，浏览器打开 `http://localhost:3000` 就可以本地预览服务端渲染的页面。

*server.js* 会导出一个 `render` 函数：

```ts
import { StaticRouterContext } from "react-router";

interface RenderOptions {
  // 请求 URL
  url?: string;
  // 请求 path
  path?: string;
  // 请求 query
  query?: Record<string, string>;
  // 缓存全局状态，当路由组件有路径跳转时需要用到
  cachedState?: Record<PropertyKey, unknown>;
  // 缓存 Location，当路由组件有路径跳转时需要用到
  cachedLocation?: Record<PropertyKey, unknown>;
  // 多个路由组件之间进行数据共享时会用到（未开启全局状态管理的情况下）
  shared?: Record<PropertyKey, unknown>;
}

export function render(options: RenderOptions): Promise<{
  // HTML 文档内容
  document: string;
  // 静态路由信息
  staticRouterContext: StaticRouterContext;
}>;
```

### 部署
由于个人或团队组织情况不同，所以如何将服务端渲染应用程序部署到生产环境的方案也不唯一，Luban 提供了一份[==TODO==部署指南](./deployment-guide.md)，仅供参考。


## FAQ
### 访问 Window, document 等对象时报错？
服务端渲染模式下运行客户端侧的代码需要创建一个 [v8虚拟机](https://nodejs.org/docs/latest/api/vm.html#vm_vm_executing_javascript) 并在[当前上下文](https://nodejs.org/docs/latest/api/vm.html#vm_script_runinthiscontext_options)(并不是[一个新的上下文](https://nodejs.org/docs/latest/api/vm.html#vm_script_runinnewcontext_contextobject_options)运行客户端代码，在这个上下文环境中并没有浏览器才有的 DOM API，所以首次在服务端侧渲染时会报错，应该在特定生命周期函数访问这些 API：

```tsx {9,10,11}
import React from "react";
import { EnhancedRouteComponentProps } from "@/.luban";

class Example extends React.Component<EnhancedRouteComponentProps, unknown> {
  constructor(props: EnhancedRouteComponentProps) {
    super(props);
  }
    
  componentDidMount(): void {
    console.info(document.body.clientWidth);
  }

  render(): JSX.Element {
    return <h1>{this.props.name}</h1>;;
  }
}

export default Example;
```

函数时组件使用 `useEffect`：

```tsx {5,6,7}
import React, { useEffect } from "react";
import { EnhancedRouteComponentProps, Page } from "@/.luban";

const Example: Page<EnhancedRouteComponentProps> = ({ name }) => {
  useEffect(() => {
    console.info(document.body.clientWidth);
  }, []);
    
    return <div>{name}</div>;
};

export default Example;
```

### 如何排除一些依赖模块？

Luban 在服务端侧的 webpack 配置中默认使用 [webpack-node-externals](https://github.com/liady/webpack-node-externals) 排除掉了所有 *node_modules* 下的模块，配置如下：

```js {6,7}
const nodeExternals = require('webpack-node-externals');

module.exports = {
    // ...
    target: "node",
    // 不排除 css 和 less 模块(文件)
    externals: [nodeExternals({ allowlist: [/\.(css|less)$/] })],
    // ...
};
```

若是需要不排除特定模块可以修改此配置。比如不排除 [antd](https://ant.design/)：

```js {6,7}
const nodeExternals = require('webpack-node-externals');

module.exports = {
    // ...
    target: "node",
    // 不排除 css 和 less 模块(文件)，不排除 antd
    externals: [nodeExternals({ allowlist: [/\.(css|less)$/, /^antd/] })],
    // ...
};
```

### 如何判断代码是在哪端执行？

直接访问 `__IS_BROWSER__` 可以判断代码是在那端执行：
```ts
if (__IS_BROWSER__) {
  // client side
} else {
  // server side
}
```

不论是在组件中或者在 `getInitialProps` 函数中都可以访问 `__IS_BROWSER__`。

::: tip
不过需要注意的是，不可以通过 `__IS_BROWSER__` 来渲染不同的内容：

```tsx
if (__IS_BROWSER__) {
  return <span>some content</span>
} else {
  return <strong>another content</strong>
}
```

这样的条件渲染在单纯的客户端渲染模式下没有任何问题，但是在服务端渲染模式下会造成两端渲染结果不一致，==React== 会对渲染过程中的不匹配进行警告。
:::


### 如何重定向？

### `getInitialProps` 参数 `context` 对象的 `params` 和 `query` 有什么区别？
