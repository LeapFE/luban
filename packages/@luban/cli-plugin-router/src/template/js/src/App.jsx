import { hot } from "react-hot-loader/root";
import React from "react";

import { LubanRouter } from "luban-router";

import { config } from "./router/config";

const App = () => <LubanRouter config={config} />;

export default hot(App);
