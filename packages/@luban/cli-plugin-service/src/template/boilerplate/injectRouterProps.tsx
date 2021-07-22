import React, { Component } from "react";

import { DefaultRouteProps } from "./definitions";
import { ComponentType } from "./index";

import { store } from "./store";

interface MountPropsComponentState {
  extraProps: Record<string, unknown>;
  loading: boolean | null;
}

interface MountPropsComponent extends Component<DefaultRouteProps, MountPropsComponentState, {}> {
  getInitialProps: () => Promise<void>;
}

let mountPropsComponent: MountPropsComponent | null = null;
let routerChanged = false;

function handlePopState() {
  routerChanged = true;

  if (!location.hash && mountPropsComponent && mountPropsComponent.getInitialProps) {
    mountPropsComponent.getInitialProps();
  }
}

export function injectRouteComponentProps(
  WrappedComponent: ComponentType<any>,
): React.ComponentClass<DefaultRouteProps, MountPropsComponentState> {
  class MountPropsInnerComponent extends Component<DefaultRouteProps, MountPropsComponentState, {}>
    implements MountPropsComponent {
    constructor(props: DefaultRouteProps) {
      super(props);

      this.state = {
        extraProps: {},
        loading: null,
      };

      if (!routerChanged) {
        routerChanged = !window.__USE_SSR__ || (props.history && props.history.action === "PUSH");
      }

      if (window.__USE_SSR__) {
        mountPropsComponent = this;
        window.addEventListener("popstate", handlePopState);
      }
    }

    async componentDidMount() {
      window.__SHARED_DATA__ = {};
      this.setState({ loading: null });

      const isGetInitialProps = (this.props.history && this.props.history.action !== "POP") || !window.__USE_SSR__;
      const hasStaticMethod = typeof WrappedComponent.getInitialProps === "function"
      if (isGetInitialProps && hasStaticMethod) {
        await this.getInitialProps();
      }
    }

    async getInitialProps() {
      this.setState({ loading: true });

      if (WrappedComponent.preload) {
        WrappedComponent = (await WrappedComponent.preload()).default;
      }

      const searchParams = new URLSearchParams(this.props.location.search);
      const query = Object.fromEntries(searchParams.entries());

      const extraProps = WrappedComponent.getInitialProps
        ? await WrappedComponent.getInitialProps({
            path: this.props.match.path,
            store,
            params: this.props.match.params,
            query,
            url: this.props.location.pathname,
          }, window.__SHARED_DATA__)
        : {};

      this.setState({
        extraProps,
        loading: false,
      });
    }

    render() {
      const { extraProps, loading } = this.state;

      const initData = routerChanged ? {} : window.__INITIAL_DATA__;
      const initState = routerChanged ? {} : window.__INITIAL_STATE__;
      const finalProps = { ...this.props, ...initData, ...extraProps, ...initState };

      return <WrappedComponent {...finalProps} initialing={loading} />;
    }
  }

  return MountPropsInnerComponent;
}
