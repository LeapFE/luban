import React, { FunctionComponent } from "react";

<%_ if (useStore) { _%>
import { Todo } from "../Todo";
<%_ } _%>

<%_ if (useFetch) { _%>
import { UserList } from "../UserList";
<%_ } _%>

import logo from "./../../assets/logo.svg";

import styles from "./index.less";

interface WelcomeProps {
  pageName: string;
}

const Welcome: FunctionComponent<WelcomeProps> = ({ pageName }) => (
  <div className={styles.App}>
    <header className="App-header">
      <h2>
        {pageName}
        &nbsp;page
      </h2>
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        <span role="img" aria-label="keyboard">
          ⌨️&nbsp;
        </span>
        Edit&nbsp;
        <code><%= modifyFile %></code>
        &nbsp;and save to reload.
      </p>
      <a
        className="App-link"
        href="https://1x.luban.fun"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span role="img" aria-label="link">
          🔗&nbsp;
        </span>
        Visit more about Luban documentation.
      </a>

      <%_ if (useStore) { _%>
      <Todo />
      <%_ } _%>

      <%_ if (useFetch) { _%>
      <UserList />
      <%_ } _%>
    </header>
  </div>
);

export { Welcome };
