import React from "react";
import { run } from "@/.luban";

import { Nav } from "@/components/Nav";

import route from "@/route";

export default run({
  wrapper: (props) => <Nav {...props} />,
  route,
  // models: { count },
});
