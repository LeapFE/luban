import { hot } from "react-hot-loader/root";
import React from "react";

import { Welcome } from "@/components/Welcome";

const App = () => (<Welcome pageName="Index" />);

export default hot(App);
