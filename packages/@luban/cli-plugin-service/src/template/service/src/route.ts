/**
 * DO NOT MOVE THIS FILE ELSEWHERE
 */

import { route } from "@/.luban";

export default route({
  // fallback: "@/components/Fallback",
  routes: [
    {
      path: "/",
      redirect: "/prev",
    },
    {
      name: "Prev",
      path: "/prev",
      component: "@/pages/prev",
    },
    {
      name: "Next",
      path: "/next",
      component: "@/pages/next",
    },
  ],
});
