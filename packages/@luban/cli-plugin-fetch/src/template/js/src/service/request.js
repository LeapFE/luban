import axios from "axios";

import { APP_URL } from "./env";

const request = axios.create({ baseURL: `${APP_URL}/api/` });

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
