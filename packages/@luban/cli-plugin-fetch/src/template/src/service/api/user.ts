/* eslint-disable */

/* prettier-ignore-start */
import { request } from "../request";

import { ResponseData } from "../interface/public";
import { UserItem, getUserListQuery } from "../interface/user";
import { AxiosRequestConfig } from "axios";

export function getUserList(params: getUserListQuery, config?: AxiosRequestConfig) {
  const url = params.name ? `/api/users?name=${params.name}` : "/api/users";
  return request.get<ResponseData<UserItem[]>>(url, config);
}

export function addUser(params: { name: string }, config?: AxiosRequestConfig) {
  return request.post<ResponseData<boolean>>(`/api/user/${params.name}`, null, config);
}

export function delUser(params: { id: number }, config?: AxiosRequestConfig) {
  return request.delete<ResponseData<boolean>>(`/api/user/${params.id}`, config);
}

/* prettier-ignore-end */
