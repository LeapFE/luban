import { hot } from "react-hot-loader/root";
import React from "react";

import { Welcome } from "@/components/Welcome";

const App = () => (<Welcome pageName="index" />);

export default hot(App);
