# 入口文件

*src/index.tsx* 是整个应用的入口文件，可以在这个文件里配置整个应用的路由、布局和状态管理等。该文件默认的内容如下：

```ts
import React from "react";
import { run } from "@/.luban";

import { Layout } from "./layout";

import route from "@/route";

export default run({
  layout: (props) => <Layout {...props} />,
  route,
});
```

可以看到，默认配置了一个[路由和布局](./router-layout.md)，除了这两个配置项，其他的详细配置如下：

```ts
run({
  // 应用被渲染进哪个 DOM 元素，应该是该元素的 id
  root?: string;

  // 指定一个组件，该组件将会在创建应用路由之前被渲染
  prepare?: string;

  // 应用布局组件
  layout?: (params: LayoutProps) => JSX.Element;

  // 应用路由配置
  route: OriginRouteConfig;

  // 应用 store 的数据模型
  models?: InitConfig["models"];
});
```

关于 `prepare` `route` `layout` 的详细配置可以查阅[路由和布局](./router-layout.md)。

关于 `models` 的详细配置可以查阅[状态管理](./store.md)。