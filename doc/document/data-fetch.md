# 数据请求

多数应用都需要通过 HTTP 协议完成与服务端的通信。Luban 内置了 [axios](https://github.com/axios/axios) 作为默认的 HTTP 请求库。

在 *src/service/request.ts* 文件中可以看到通过 ==axios== 创建了一个请求实例：
``` ts
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";

import { APP_URL } from "./env";

const request = axios.create({ baseURL: `${APP_URL}/api/` });

request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);
```

其中 `APP_URL` 是 dotenv 文件中指定的环境变量，此处为请求接口服务地址，推荐通过 *src/service/env.ts* 来统一导出被注入的环境变量。关于如何配置请求拦截、取消、超时等，查阅 [axios](https://github.com/axios/axios) 获取更多信息。
