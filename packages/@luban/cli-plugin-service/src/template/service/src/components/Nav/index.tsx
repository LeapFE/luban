import React, { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";

import styles from "./index.less";

const Nav: FunctionComponent = (props) => {
  return (
    <div className={styles["app-wrapper"]}>
      <div className="nav-wrapper">
        <NavLink to="/prev" activeClassName="activity" exact>
          Prev
        </NavLink>
        &nbsp;&nbsp;&nbsp;
        <NavLink to="/next" activeClassName="activity" exact>
          Next
        </NavLink>
      </div>

      <div>{props.children}</div>
    </div>
  );
};

export { Nav };
