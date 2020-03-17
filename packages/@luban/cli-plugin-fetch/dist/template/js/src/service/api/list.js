import { request } from "../request";

/**
 * this is a example request method
 */
export function getList(params) {
  return request.get(`/list?page=${params.page}&size=${params.size}`);
}
