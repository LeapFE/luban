import { request } from "../request";


export function getUserList(params) {
  const url = params.name ? `/api/users?name=${params.name}` : "/api/users";
  return request.get(url);
}

export function addUser(params) {
  return request.post(`/api/user/${params.name}`);
}

export function delUser(params) {
  return request.delete(`/api/user/${params.id}`);
}
