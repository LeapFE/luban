import { Home } from "@/views/Home";
import { User } from "@/views/User";

export const config = {
  routes: [
    {
      name: "Home",
      path: "/",
      component: Home,
      meta: { name: "Home" },
    },
    {
      name: "User",
      path: "/user",
      component: User,
      meta: { name: "User" },
    },
  ],
};
