import { hot } from "react-hot-loader/root";
import React from "react";

import { LubanRouter } from "luban-router";

import { config } from "@/route/config";

const App = () => <LubanRouter config={config} />;

export default hot(App);
