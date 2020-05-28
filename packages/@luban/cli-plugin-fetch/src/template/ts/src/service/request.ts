import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";

import { APP_SERVER } from "./env";

const request = axios.create({ baseURL: `${APP_SERVER}/api/` });

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

export { request };
