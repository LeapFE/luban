import React, { FunctionComponent } from "react";

<%_ if (useRouter) { _%>
import { Todo } from "../todo";
<%_ } _%>

import logo from "./../../assets/logo.svg";

import styles from "./index.less";

interface WelcomeProps {
  pageName: string;
}

const Welcome: FunctionComponent<WelcomeProps> = ({ pageName }) => (
  <div className={styles.App}>
    <header className="App-header">
      <%_ if (useRouter) { _%>
      <Todo />
      <%_ } _%>
      <h2>
        This is&nbsp;
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
        href="https://luban.now.sh"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span role="img" aria-label="link">
          🔗&nbsp;
        </span>
        Visit more about Luban documentation.
      </a>
    </header>
  </div>
);

export { Welcome };
