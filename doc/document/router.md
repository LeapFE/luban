# 路由系统

Luban 内置使用 [luban-router](https://github.com/leapFE/luban-router) 来构建整个应用的路由系统。luban-router 是一个基于
[react-router](https://reacttraining.com/react-router/web/guides/quick-start) 静态路由管理器，并额外提供了以下功能：

- 📄 中心化的配置式路由
- 🚥 路由鉴权
- 🚏 菜单导航

::: tip 🙋
luban-router 创建的路由均为静态路由，所以若是有创建动态路由的需求，luban-router 并不适合。另外在路由配置中提到的 **子路由** 或者 **路由嵌套** 也是一个伪概念，只是表示一种菜单导航上的层级关系。在内部实现时，最终会将这种嵌套结构拍平。 
:::

## 如何使用

#### 1. 安装
```shell
npm i luban-router --save
```

#### 2. 添加配置
```typescript
// config.ts
import { RouteConfig } from "luban-router/lib/definitions";

// import your component
// ...

export const config: RouteConfig = {
  routes: [
    {
      name: "首页",
      path: "/",
      component: Index,
      children: [
        {
          name: "列表",
          path: "/list",
          component: List,
        },
      ],
    },
    {
      name: "用户中心",
      path: "/user",
      authority: [66, 88, 99],
      component: User,
    },
    // path 为 404 的路由将作为整个应用的 404 回退页面
    {
      path: "404",
      component: NotFound,
    },
  ],
};
```

#### 3. 在你的应用中使用 ` <LubanRouter /> `
```tsx
import React from "react";
import ReactDOM from "react-dom";
import { LubanRouter } from "luban-router";

import { config } from "./config.js";

const root = document.getElementById("root");
ReactDOM.render(<LubanRouter config={config} />, root);
```

更多路由相关类型定义请查阅[这里](https://github.com/leapFE/luban-router/blob/master/src/definitions.ts)。

## 路由元信息

定义路由的时候可以使用 `meta` 字段：
```typescript
// config.ts
import { RouteConfig } from "luban-router/lib/definitions";

// import your component
// ...

export const config: RouteConfig = {
  routes: [
    {
      name: "首页",
      path: "/",
      component: Index,
      meta: { nav: true }
    },
  ],
};
```

这个 `meta` 字段会在创建路由的时候将会作为 `props` 原模原样的传递给对应的组件。

同样这个字段在你创建应用导航菜单是也很有用。详细见下面[导航菜单](#导航菜单)。


## 路由鉴权
当你给 `<LubanRouter />` 设置了 `role` 参数，在创建路由的时候就会检查每一个路由项是否能被当前 `role` 访问；
```typescript
<LubanRouter config={config} role={66} />
```

也可以传递一个数组：
```typescript
<LubanRouter config={config} role={[66, 88, 99]} />
```

默认的检查策略是求 `role` 与路由项 `authority` 的交集。

比如当前角色为 `66`，路由配置中某一个路由项的 authority 为 `[66, 55, 77]`，那个这个路由项就可以被访问到，当角色变为 `88`，则不能被访问到。


## 导航菜单

luban-router 默认不带有任何的布局方案，你可以通过下面这种方式来实现自定义布局：
```typescript
 <LubanRouter config={config} role={66}>
  {({ renderedTable, matchedRouteList, permissionRouteList }) => {
    return (
        <div>
        // 渲染侧边栏导航
        // 渲染面包屑导航
        // ...
        </div>
    );
  }}
</LubanRouter>
```

`<LubanRouter />` 除了接收 `config` 和 `role` 参数外，你也可以提供 `children` 参数，该回调函数接收三个参数。

其中，第一个参数是已经渲染好的路由表，可以直接使用，第二个参数是与当前路径匹配的路由列表，第三个参数是当前角色可有权访问的路由表（这个路由表是嵌套结构的）。其中第二个参数的路由列表的路由项会追加一个 `active` 字段，表示当前活跃的路由项，可以很方便的实现面包屑导航。更多路由项定义请查阅[这里](https://github.com/leapFE/luban-router/blob/master/src/definitions.ts)。


## 路由赖加载
在构建时，JavaScript 包会变得非常大，影响页面加载时间。这个时候我们希望按路由将打包后的代码进行分割，然后在当前路由被访问时才去加载对应的代码块文件。

结合 [React.lazy](https://reactjs.org/docs/code-splitting.html#reactlazy) API 和 [webpack](https://webpack.js.org/guides/code-splitting/#root) 的代码分割功能，可以轻松的实现路由的赖加载。

第一步，通过 `React.lazy` 和 [动态import](https://webpack.js.org/guides/code-splitting/#dynamic-imports) 引入组件

```typescript
const Index = React.lazy(() => import("./Index"));
```

第二步，在 *config.ts* 中不用做任何改变，像之前一样使用它：
```typescript
// config.ts
import { RouteConfig } from "luban-router/lib/definitions";

// import your component

export const config: RouteConfig = {
  routes: [
    {
      name: "首页",
      path: "/",
      component: Index,
    },
  ],
};
```

同时，你也可以对路由进行分组，指定一个 [chunk name](https://webpack.js.org/api/module-methods/#magic-comments)，将一组路由组件打包到一个 chunk 中：
```typescript
const Index = React.lazy(() => import(/* webpackChunkName: "group-index" */  "./Index"));
const User = React.lazy(() => import(/* webpackChunkName: "group-user" */  "./User"));
const About = React.lazy(() => import(/* webpackChunkName: "group-about" */  "./About"));
```
