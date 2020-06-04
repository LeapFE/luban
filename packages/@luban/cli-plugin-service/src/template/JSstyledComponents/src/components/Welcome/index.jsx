import React from "react";
import PropTypes from "prop-types";

<%_ if (useStore) { _%>
import { Todo } from "../Todo";
<%_ } _%>

<%_ if (useFetch) { _%>
import { UserList } from "../UserList";
<%_ } _%>

import logo from "./../../assets/logo.svg";

import { AppWrapper, GlobalStyle } from "./index.css";

const Welcome = ({ pageName }) => (
  <AppWrapper>
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
        href="https://luban.now.sh"
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

    <GlobalStyle />
  </AppWrapper>
);

Welcome.propTypes = {
  pageName: PropTypes.string.isRequired,
};

export { Welcome };
