import React, { Component } from "react";

import { ComponentType } from "./index";

import { store } from "./store";

interface MountPropsComponentState {
  extraProps: Record<string, unknown>;
  loading: boolean | null;
}

interface MountPreparerPropsComponent extends Component<{}, MountPropsComponentState, {}> {
  getInitialProps: () => Promise<void>;
}

let mountPropsComponent: MountPreparerPropsComponent | null = null;
let routerChanged = false;

function handlePopState() {
  routerChanged = true;

  if (!location.hash && mountPropsComponent && mountPropsComponent.getInitialProps) {
    mountPropsComponent.getInitialProps();
  }
}

export function injectPreparerComponentProps(WrappedComponent: ComponentType<any>) {
  class MountPropsInnerComponent extends Component<{}, MountPropsComponentState, {}>
    implements MountPreparerPropsComponent {
    constructor(props: {}) {
      super(props);

      this.state = {
        extraProps: {},
        loading: null,
      };

      if (window.__USE_SSR__) {
        mountPropsComponent = this;
        window.addEventListener("popstate", handlePopState);
      }
    }

    async componentDidMount() {
      window.__SHARED_DATA__ = window.__SHARED_DATA__ || {};
      this.setState({ loading: null });

      if (!window.__USE_SSR__) {
        await this.getInitialProps();
      }
    }

    async getInitialProps() {
      this.setState({ loading: true });

      const searchParams = new URLSearchParams(window.location.search);
      const query = Object.fromEntries(searchParams.entries());

      const extraProps = WrappedComponent.getInitialProps
        ? await WrappedComponent.getInitialProps({
            path: window.location.pathname,
            store,
            params: {},
            query: query,
            url: window.location.pathname,
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
