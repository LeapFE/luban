import React, { CSSProperties, FunctionComponent, useEffect } from "react";
import { LoadingComponentProps } from "react-loadable";

import { TopProgress } from "./topProgress";

const progressBar = new TopProgress();

const suspenseFallbackStyle: CSSProperties = {
  width: "100%",
  height: "98vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "2rem",
};

const retryBtnStyle: CSSProperties = {
  padding: "0.2rem 0.6rem",
  borderRadius: "1.8rem",
  outline: "none",
  border: "1px solid #61dafb",
  marginTop: "0.4rem",
  backgroundColor: "#fff",
  color: "#555",
  fontSize: "inherit",
  marginLeft: "1rem",
  fontWeight: "bold",
  cursor: "pointer",
};

export const defaultLoadingProps: LoadingComponentProps = {
  isLoading: false,
  error: null,
  timedOut: false,
  pastDelay: false,
  retry: () => undefined,
};

export const DefaultFallback: FunctionComponent<LoadingComponentProps> = (props) => {
  useEffect(() => {
    progressBar.show();

    return () => {
      progressBar.finish();
    };
  }, []);

  const retry = () => {
    progressBar.show();

    props.retry();
  };

  if (props.error) {
    progressBar.finish();
    return (
      <div style={suspenseFallbackStyle}>
        Ops! Something Wrong
        <button style={retryBtnStyle} onClick={retry}>
          Retry
        </button>
      </div>
    );
  } else if (props.timedOut) {
    progressBar.finish();

    return (
      <div style={suspenseFallbackStyle}>
        Taking a long time...
        <button style={retryBtnStyle} onClick={retry}>
          Retry
        </button>
      </div>
    );
  } else {
    return null;
  }
};
