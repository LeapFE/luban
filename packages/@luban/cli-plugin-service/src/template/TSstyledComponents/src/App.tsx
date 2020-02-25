import { hot } from "react-hot-loader/root";
import React, { FunctionComponent } from "react";

import { Welcome } from "./components/welcome";

const App: FunctionComponent = () => (<Welcome pageName="Index" />);

export default hot(App);
