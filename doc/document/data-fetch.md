# 数据请求

多数应用都需要通过 HTTP 协议完成与服务端的通信。Luban 内置了 [axios](https://github.com/axios/axios) 作为默认的 HTTP 请求库。

在 *src/service/request.ts* 文件中可以看到通过 ==axios== 创建了一个请求实例：
``` ts
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";

import { APP_SERVER } from "./env";

const request = axios.create({ baseURL: `${APP_SERVER}/api/` });

export { request };
```

其中 `APP_SERVER` 是 dotenv 文件中指定的环境变量，此处为请求接口服务地址，推荐通过 *src/service/env.ts* 来统一导出被注入的环境变量。关于如何配置请求拦截、取消、超时等，查阅 [axios](https://github.com/axios/axios) 获取更多信息。

解决了与服务端的通信问题，还需要将服务端返回的数据在组件中进行展示，Luban 内置了 [use-request](https://www.npmjs.com/package/@luban-hooks/use-request) 来完成这一步。在 *service/api/user.ts* 中默认放置了一些 service function，可以通过 ==use-request== 来调用这个函数:

```tsx
import React, { FunctionComponent } from "react";
import { useRequest } from "@luban-hooks/use-request";

import { getUserList } from "@/service/api/user";

const UserList: FunctionComponent = () => {
  const { data, loading } = useRequest(getUserList);
  
  if (loading) {
    return <div>loading</div>
  }

  // render data
  return <div />;
}
```

更详细的使用方法查阅 [use-request](https://www.npmjs.com/package/@luban-hooks/use-request)。

## Mock Server

开发过程中通常需要根据文档 mock 一些数据在页面中展示，而不必因为服务接口的滞后交付而阻塞前端开发过程。

约定 *mock/index.js* 为默认的 mock 配置文件，可以在这个文件中编写 mock 接口：

```javascript
// mock/index.js
module.exports = {
  "GET /api/users": { users: [1, 2] },

  "POST /api/user/:name": (req, res) => {
    res.setHeader("A-http-header", "value");
    res.end("ok");
  },
};
```

每一个路由对应的值可以是一个对象或者一个自定义函数，自定义函数的用法可以查阅 express 的 [routing](https://www.expressjs.com.cn/guide/routing.html)。

同时可以引入 [mock.js](http://mockjs.com/) 来快速的 mock 数据：

```javascript
// mock/index.js
const mock = require("mockjs");

module.exports = {
  "GET /api/users": mock.mock({
    "list|100": [{ name: "@city", "value|1-100": 50, "type|0-2": 1 }],
  }),
};
```


### 关闭 Mock Server

可以配置 *luban.config.ts* 中的 `mock` 选项来关闭或者开启 mock server:

```ts
// luban.config.ts
import { createProjectConfig } from "@luban-cli/cli-plugin-service";

export default createProjectConfig({
  mock: false,
});
```
