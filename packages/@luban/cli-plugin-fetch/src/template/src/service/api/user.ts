/* eslint-disable */

/* prettier-ignore-start */
import { request } from "../request";

import { ResponseData } from "../interface/public";
import { UserItem, getUserListQuery } from "../interface/user";

export function getUserList(params: getUserListQuery) {
  const url = params.name ? `/api/users?name=${params.name}` : "/api/users";
  return request.get<ResponseData<UserItem[]>>(url);
}

export function addUser(params: { name: string }) {
  return request.post<ResponseData<boolean>>(`/api/user/${params.name}`);
}

export function delUser(params: { id: number }) {
  return request.delete<ResponseData<boolean>>(`/api/user/${params.id}`);
}

/* prettier-ignore-end */
