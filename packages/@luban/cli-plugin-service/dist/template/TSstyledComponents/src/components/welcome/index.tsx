import React, { FunctionComponent } from "react";

import { AppWrapper, GlobalStyle } from "./App.css";

import logo from "./../../assets/logo.svg";

interface WelcomeProps {
  pageName: string;
}

const Welcome: FunctionComponent<WelcomeProps> = ({ pageName }) => (
  <AppWrapper>
    <header className="App-header">
      <h2>This is {pageName} page</h2>
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
        href="https://github.com/front-end-captain/luban/blob/master/packages/%40luban/cli/README.md"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span role="img" aria-label="link">
          🔗&nbsp;
        </span>
        Visit more about Luban documentation.
      </a>

      <GlobalStyle />
    </header>
  </AppWrapper>
);

export { Welcome };
