import { request } from "../request";

import { ResponseData } from "../interface/public";
import { UserItem, getUserListQuery } from "../interface/user";


export function getUserList(params: getUserListQuery) {
  const url = params.name ? `/users?name=${params.name}` : "/users";
  return request.get<ResponseData<UserItem[]>>(url);
}

export function addUser(params: { name: string }) {
  return request.post<ResponseData<boolean>>(`/user/${params.name}`);
}

export function delUser(params: { id: number }) {
  return request.delete<ResponseData<boolean>>(`/user/${params.id}`);
}
