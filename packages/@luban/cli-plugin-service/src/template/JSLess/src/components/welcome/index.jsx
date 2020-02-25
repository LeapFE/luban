import React from "react";

import logo from "../../assets/logo.svg";

import styles from "./index.less";

const Welcome = ({ pageName }) => (
  <div className={styles.App}>
    <header className={styles["App-header"]}>
      <h2>
        This is
        {pageName}
        page
      </h2>
      <img src={logo} className={styles["App-logo"]} alt="logo" />
      <p>
        <span role="img" aria-label="keyboard">
          ⌨️&nbsp;
        </span>
        Edit&nbsp;
        <code><%= modifyFile %></code>
        &nbsp;and save to reload.
      </p>
      <a
        className={styles["App-link"]}
        href="https://github.com/front-end-captain/luban/blob/master/packages/%40luban/cli/README.md"
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
