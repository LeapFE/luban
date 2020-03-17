import { request } from "../request";

import { ResponseData } from "../interface/public";
import { getListQuery, ListData } from "../interface/list";

/**
 * this is a example request method
 */
export function getList(params: getListQuery) {
  return request.get<ResponseData<ListData>>(`/list?page=${params.page}&size=${params.size}`);
}
