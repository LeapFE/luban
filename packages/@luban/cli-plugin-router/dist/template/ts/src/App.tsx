import { hot } from "react-hot-loader/root";
import React, { FunctionComponent } from "react";

import { LubanRouter } from "luban-router";

import { config } from "./router/config";

const App: FunctionComponent = () => <LubanRouter config={config} />;

export default hot(App);
