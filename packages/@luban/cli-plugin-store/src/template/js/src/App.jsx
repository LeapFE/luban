import { hot } from "react-hot-loader/root";
import React from "react";
import { Provider } from "react-redux";

<%_ if (useRouter) { _%>
import { LubanRouter } from "luban-router";
import { config } from "@/route/config";
<%_ } else { _%>
import { Welcome } from "@/components/welcome";
<%_ } _%>


import { store } from "@/models/store";


<%_ if (useRouter) { _%>
const App = () => {
  return (
    <Provider store={store}>
      <LubanRouter config={config} />
    </Provider>
  );
};
<%_ } else { _%>
const App = () => (<Provider store={store}><Welcome pageName="index" /></Provider>);
<%_ } _%>

export default hot(App);
