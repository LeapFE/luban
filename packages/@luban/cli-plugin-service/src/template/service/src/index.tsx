import React from "react";
import { run } from "@/.luban";

import { Layout } from "./layout";

import route from "@/route";

export default run({
  layout: (props) => <Layout {...props} />,
  route,
});
