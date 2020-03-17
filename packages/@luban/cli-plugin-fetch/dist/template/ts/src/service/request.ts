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

export { request };
