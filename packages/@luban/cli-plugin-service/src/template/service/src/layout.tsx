import { LayoutProps } from "luban";
import React, { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";

import styles from "./layout.less";

const Layout: FunctionComponent<LayoutProps> = (props) => {
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

export { Layout };
