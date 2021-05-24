import React, { FunctionComponent, CSSProperties } from "react";

const DefaultNotFound: FunctionComponent = () => {
  const DefaultNotfoundStyle: CSSProperties = {
    width: "100%",
    height: "98vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.4rem",
    color: "#ccc",
  };

  return <div style={DefaultNotfoundStyle}>The page you visited is not found!</div>;
};

export { DefaultNotFound };
