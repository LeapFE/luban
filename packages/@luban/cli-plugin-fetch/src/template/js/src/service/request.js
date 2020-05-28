import axios from "axios";

import { APP_SERVER } from "./env";

const request = axios.create({ baseURL: `${APP_SERVER}/api/` });

request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export { request };
