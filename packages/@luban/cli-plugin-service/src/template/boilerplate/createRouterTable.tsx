import React, { ReactElement, isValidElement, createElement } from "react";
import { Route, RouteComponentProps, Redirect, RedirectProps } from "react-router-dom";

import { mountProps } from "./mountProps";

import { Role, CustomCheckAuthority, RouteComponent, BasicRouterItem } from "./definitions";

import { checkAuthority } from "./util";

function generateRedirectRouteProps(
  route: BasicRouterItem,
  defaultUnAuthorityPath: string,
): RedirectProps & { key: string } {
  const { component: Component, redirect, path, exact, strict } = route;

  let toPath = redirect || defaultUnAuthorityPath;
  let routeKey = `${path}-${redirect}`;

  if (Component === undefined && redirect === undefined) {
    toPath = defaultUnAuthorityPath;
    routeKey = `${path}-${defaultUnAuthorityPath}`;
  }

  return {
    key: routeKey,
    to: toPath,
    exact,
    strict,
    from: path,
  };
}

function renderRouteComponent(
  route: BasicRouterItem,
  props: RouteComponentProps,
  authorityChecker: CustomCheckAuthority,
  role?: Role,
): ReactElement {
  const { component: Component, authority, unAuthorityPath, meta, redirect, path, name } = route;

  let defaultUnAuthorityPath = "/404";

  if (typeof role === "undefined") {
    if (Component === undefined || typeof redirect === "string") {
      return <Redirect {...generateRedirectRouteProps(route, defaultUnAuthorityPath)} />;
    }

    const C = mountProps(Component);
    return <C {...props} meta={meta} name={name} />;
  }

  if (authorityChecker(role, authority)) {
    if (Component === undefined || typeof redirect === "string") {
      return <Redirect {...generateRedirectRouteProps(route, defaultUnAuthorityPath)} />;
    }

    const C = mountProps(Component);
    return <C {...props} meta={meta} name={name}  />;
  }

  if (typeof unAuthorityPath === "string") {
    defaultUnAuthorityPath = unAuthorityPath;
  }

  if (typeof unAuthorityPath === "function") {
    defaultUnAuthorityPath = unAuthorityPath(role);
  }

  return (
    <Redirect key={`${path}-${defaultUnAuthorityPath}`} from={path} to={defaultUnAuthorityPath} />
  );
}

type createRouterTableOptions = {
  role?: Role;
  NotFound?: RouteComponent;
  customCheckAuthority?: CustomCheckAuthority;
};

function createRouterTable(
  routes: Array<BasicRouterItem>,
  options: createRouterTableOptions,
): Array<ReactElement> {
  const { role, NotFound, customCheckAuthority } = options;

  const table: ReactElement[] = [];

  const reversedRoutes: Array<BasicRouterItem> = Array.from(routes).reverse();

  const authorityChecker =
    typeof customCheckAuthority === "function" ? customCheckAuthority : checkAuthority;

  reversedRoutes.forEach((route) => {
    const { path, component: Component, exact = true, strict = true } = route;

    // Component is not undefined, check it valid element
    if (Component !== undefined) {
      if (!isValidElement(createElement(Component, null))) {
        console.error(`path ${path} mapping component is not a valid React Element`);
        return;
      }
    }

    if (route.path.includes("404")) {
      return;
    }

    const routeComponent = (
      <Route
        key={path}
        exact={exact}
        path={path}
        strict={strict}
        render={(props: RouteComponentProps): ReactElement => {
          return renderRouteComponent(route, props, authorityChecker, role);
        }}
      />
    );

    table.push(routeComponent);
  });

  const notFoundRoute = <Route path="/404" key="/404" exact component={NotFound} />;
  table.unshift(notFoundRoute);

  const fallBackRoute = <Route path="*" key="*" component={NotFound} />;
  table.push(fallBackRoute);

  return table;
}

export { createRouterTable };
