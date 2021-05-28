# 服务端渲染

Luban 提供的服务端渲染可以有效减少应用内容到达时间([TTFB](https://developer.mozilla.org/zh-CN/docs/Glossary/time_to_first_byte))，即白屏时间和提高[SEO](https://developer.mozilla.org/zh-CN/docs/Glossary/SEO)能力。且具有以下特性：

🍌 开箱即用。可一键开启，本地可同时调式客户端渲染和服务端渲染

🥦 服务端框架无关。可以使用[Koa](https://eggjs.org/), [Express](https://expressjs.com/),[Egg.js](https://eggjs.org/)等服务端框架简单集成

🌽 数据预取和状态。支持在全局和路由组件获取数据和访问状态

🧅 动态加载。支持动态加载客户端静态文件

## 是否真的需要服务端渲染

与 SPA (单页应用程序 (Single-Page Application)) 相比，服务器端渲染具有以下两个大的优势：

- 更好的 SEO，搜索引擎和爬虫抓取工具可以直接查看完全渲染的页面。

- 更快的 TTFB，特别是对于缓慢的网络情况或运行缓慢的设备。无需等待所有的 JavaScript 都完成下载并执行，才显示服务器渲染的标记，所以用户将会更快速地看到完整渲染的页面。可以产生更好的用户体验，特别是那些对转化率要求较高的应用而言，服务器端渲染 (SSR) 至关重要。

当然服务端渲染不是万能的，也要考虑以下问题：

- 开发条件限制。浏览器特定 API，只能在某些生命周期函数中使用；一些第三方库可能需要特殊处理，才能在服务端渲染模式下正常运行。

- 构建和部署的更多要求。与单页应用直接部署静态文件不同不同，服务端渲染应用本质是一个 Nodejs 应用程序，需要一个 Nodejs 完整运行环境。部署时需要考虑诸如缓存策略、负载、高可用等等服务端应用程序需要考虑的问题。

在开启服务端渲染模式之前，应该认证考虑是否真的需要服务端渲染。这取决于应用程序是否对 TTFB 有着非常高的诉求。例如一些内部使用的管理系统、营销系统等等，对初始加载时的额外几百毫秒并不敏感，这种情况下开启服务端渲染显然是得不偿失的。然而，对 TTFB 敏感的应用，服务器端渲染可以实现最佳的初始加载时间。

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

```ts
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

上面例子中提的 `getInitialProps` 赋予了路由组件可以在服务端侧获取数据的能力，同时也可以访问请求路径、参数等：

```ts
Demo.getInitialProps = (context) => {
  console.log(context.path);
  console.log(context.url);
  console.log(context.params);
  console.log(context.query);

  return {};
};
```

该函数的可以返回一个 Promise 也可以直接返回一个值：

```ts
Demo.getInitialProps = (context) => {
  // 返回一个 Promise
  return Promise.resolve();

  // 返回一个 Promise
  return new Promise(() => { ... });

  // 返回一个值
  return { users: [] }
};
```

### 访问和更新全局状态
在 *src/index.tsx* 文件中开启全局状态管理后，就可以在 `getInitialProps` 函数中消费和更新全局状态了，依然以获取数据 `users` 举例：
```ts
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

之后便可以在 `context` 对象上访问 `store` 对象。然后组件中连接 `store` 并消费状态。


## 部署

## FAQ

### 访问 Window, document 等对象时报错

### 如何 external 一些模块
