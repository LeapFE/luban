# 路由和布局

Luban 内置了一个基于[react-router](https://reacttraining.com/react-router/web/guides/quick-start) 静态路由管理器来构建整个应用的路由系统。并额外提供了以下功能：

- 📄 中心化的配置式路由
- 🧩 自动的 [code-split](https://webpack.js.org/guides/code-splitting/#root)
- 🚏 布局和导航

## 如何使用

*src/route.ts* 是配置整个应用路由的位置：
```tsx
/**
 * DO NOT MOVE THIS FILE ELSEWHERE
 */

import { route } from "@/.luban";

export default route({
  mode: "hash",
  routes: [
    // you routes ...
  ],
});
```

可以在这个 `route` 方法参数中配置应用路由是使用 `HashRouter` 还是 `BrowserRouter`，404 页面，["Loading..." Component](https://github.com/jamiebuilds/react-loadable#creating-a-great-loading-component)等。

::: tip 🙋
在开启服务端渲染后，`mode` 参数只能配置为 `browser`，即 `BrowserRouter`，若是使用了 `HashRouter`，Luban 会默认使用 `BrowserRouter`。
:::

###  添加一个路由

在 `routes` 数组中添加一个路由，并配置 `path` 和 `component`:

```typescript{4,5,6,7}
export default route({
  routes: [
    // other routes ...
    {
      path: "/example",
      component: "@/pages/example",
    },
  ],
});
```

::: tip 每个路由项支持的详细配置如下：
```ts
// 路由名称，将会作为 props 传递给对应的组件
name?: string;

// 路由路径
path: string;

// 重定向路径
redirect?: string;

// 是否与 `location.pathname` 严格匹配；默认 true
exact?: boolean;

// 是否与 `location.pathname` 严格匹配路径中尾斜杆；默认 false
strict?: boolean;

// 匹配到改路径时要渲染的组件；是一个路径；当 `redirect` 和 `component` 配置同时存在，将忽略该配置
component?: string;

// 路由元信息；将会作为 `props` 原模原样的传递给对应的组件
meta?: RouteMetaData;
```
:::

然后在 *pages* 目录下添加 *example.tsx*:
```tsx
import React from "react";
import { EnhancedRouteComponentProps, Page } from "@/.luban";

const Example: Page<EnhancedRouteComponentProps> = ({ name }) => {
  return <h1>{name}</h1>;
};

export default Example;
```

当然也可以使用 class component:
```tsx
import React from "react";
import { EnhancedRouteComponentProps } from "@/.luban";

class Example extends React.Component<EnhancedRouteComponentProps, unknown> {
  constructor(props: EnhancedRouteComponentProps) {
    super(props);
  }

  render(): JSX.Element {
    return <h1>{this.props.name}</h1>;;
  }
}

export default Example;
```

::: tip 有三点需要注意：
+ 路由组件为函数式组件时应使用 `Page` 来注解组件的类型和使用 `EnhancedRouteComponentProps` 来约束改组件的 `props` 类型。
+ 路由组件为类组件时，同样使用 `EnhancedRouteComponentProps` 来约束改组件的 `props` 类型。
+ 使用默认导出导出组件。
:::

## 布局

在入口文件 *src/index.tsx* 配置 `layout` 参数可以实现对应用的自定义布局：

```typescript{9}
import React from "react";
import { run } from "@/.luban";

import { Layout } from "./layout";

import route from "@/route";

export default run({
  layout: (props) => <Layout {...props} />,
  route,
});
```

`Layout` 组件接收三个参数：
+ 已经渲染好的路由表，可以直接使用(`props.children`)
+ 原始的路由配置，即 *route.ts* 中的 `routes` 参数(`props.originRouteList`)
+ 与 `location.pathname` 匹配到的路由项列表(`props.matchedRouteList`)

根据这些参数，可以实现对应用的自定义布局。

```tsx
import { LayoutProps } from "@/.luban/definitions";
import React, { FunctionComponent } from "react";

const Layout: FunctionComponent<LayoutProps> = (props) => {
  return (
    <div>
      // props.originRouteList
      // props.matchedRouteList
      <>{props.children}</>
    </div>
  );
};

export { Layout };
```

## 配置 Prepare
在 *src/index.tsx* 中的 `run` 方法接收的参数对象有一个 `prepare` 字段，可以指定一个组件的具体路径，该组件会在创建应用路由之前被优先渲染。

可以在创建应用路由之前做一些事情或者根据某些条件决定渲染什么：
```ts
import React from "react";
import { Page, PreparerProps } from "@/.luban";

const Preparer: Page<PreparerProps> = (props) => {
  // do something, data fetch or get localStorage data

  if (firstCondition) {
    return <div>render something</div>;
  }

  if (secondCondition) {
    // render router table
    return <>{props.children}</>;
  }

  // final render
  return <div>final render something</div>;
};

export default Preparer;
```

其中 `props.children` 为将要渲染的应用路由，可以在合适的条件下渲染它。

## 代码分割
Luban 会为每个路由项自动的进行代码分割，所以不必手动的动态导入组件。同时 Luban 内置了一个["Loading..." Component](https://github.com/jamiebuilds/react-loadable#creating-a-great-loading-component)，配置 `fallback` 参数指定自己的 "Loading..." 组件：
```ts{6}
// src/route.ts
export default route({
  routes: [
    // routes ...
  ],
  fallback: "@/MyFallback";
});
```

关于如何编写 "Loading" 组件可以查阅 [Creating a great "Loading..." Component](https://github.com/jamiebuilds/react-loadable#creating-a-great-loading-component)。

## 404 路由

`path` 为 **404** 的路由项将作为整个应用的 404 回退路由。当 `location.pathname` 匹配不到任何一个路由时，将会渲染 **404** 路由对应的组件：
```ts{4,5,6,7}
// src/route.ts
export default route({
  routes: [
    {
      path: "404",
      component: "@/pages/NotFound"
    }
  ],
});
```