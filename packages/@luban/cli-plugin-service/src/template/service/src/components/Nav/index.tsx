import { WrapperProps } from "@/.luban/definitions";
import React, { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";

import styles from "./index.less";

const Nav: FunctionComponent<WrapperProps> = (props) => {
  return (
    <div className={styles["app-wrapper"]}>
      <div className="nav-wrapper">
        {props.originRouteList.map((item) => {
          return (
            <NavLink to={item.path} activeClassName="activity" exact={item.exact} key={item.path}>
              {item.name}
            </NavLink>
          );
        })}
      </div>

      <>{props.children}</>
    </div>
  );
};

export { Nav };
