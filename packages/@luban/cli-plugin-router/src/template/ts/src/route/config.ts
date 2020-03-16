import { RouteConfig } from "luban-router/lib/definitions";

import { Home } from "@/views/Home";
import { User } from "@/views/User";

export const config: RouteConfig = {
  routes: [
    {
      name: "首页",
      path: "/",
      component: Home,
    },
    {
      name: "用户中心",
      path: "/user",
      component: User,
    },
  ],
};
