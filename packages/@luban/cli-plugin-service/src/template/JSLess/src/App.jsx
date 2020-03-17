import { hot } from "react-hot-loader/root";
import React from "react";

import { Welcome } from "@/components/welcome";

const App = () => (<Welcome pageName="index" />);

export default hot(App);
