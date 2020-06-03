import { request } from "../request";


export function getUserList(params) {
  const url = params.name ? `/users?name=${params.name}` : "/users";
  return request.get(url);
}

export function addUser(params) {
  return request.post(`/user/${params.name}`);
}

export function delUser(params) {
  return request.delete(`/user/${params.id}`);
}
