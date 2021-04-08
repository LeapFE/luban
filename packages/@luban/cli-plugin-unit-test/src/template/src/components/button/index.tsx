import React, { FunctionComponent } from "react";
import ClassNames from "classnames";

import "./index.less";

export interface ButtonProps {
  scale?: "small" | "normal" | "big";
  kind?: "primary" | "secondary" | "cancel" | "dark" | "gray";
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Button: FunctionComponent<ButtonProps> = ({ kind, scale, children, ...reset }) => (
  <button
    className={ClassNames("button", `button-${kind || "primary"}`, `button-${scale || "normal"}`)}
    {...reset}
  >
    {children || "button"}
  </button>
);

export { Button };
