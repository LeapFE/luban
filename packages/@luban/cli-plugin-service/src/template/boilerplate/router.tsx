import React, { FunctionComponent } from "react";
import { Switch, BrowserRouter, HashRouter, HashRouterProps, useLocation } from "react-router-dom";
import { pathToRegexp } from "path-to-regexp";

import { createRouterTable } from "./createRouterTable";
import { DefaultNotFound } from "./defaultNotfound";

import {
  LubanRouterProps,
  RouteComponent,
  BasicRouterItem,
  MatchedRouterItem,
  OriginNestedRouteItem,
} from "./definitions";

function useMatchedRouteList(routeList: Array<BasicRouterItem>): Array<MatchedRouterItem> {
  const { pathname } = useLocation();

  let pathSnippets = pathname.split("/").filter((p) => !!p);

  if (pathname !== "/") {
    pathSnippets = pathname.split("/").filter((i) => i);
  }

  if (pathSnippets.length === 0) {
    pathSnippets = [pathname];
  }

  const matchedRouteList: Array<MatchedRouterItem> = [];

  pathSnippets.forEach((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`.replace(/^\/{2}/g, "/");

    const targetRoute = routeList.find((route) => {
      return pathToRegexp(route.path, [], { strict: route.strict }).test(url);
    });

    if (targetRoute) {
      matchedRouteList.push({
        name: targetRoute.name,
        path: targetRoute.path,
        redirect: targetRoute.redirect,
        exact: targetRoute.exact,
        strict: targetRoute.strict,
        icon: targetRoute.icon,
        meta: targetRoute.meta,
        active: pathname === url,
      });
    }
  });

  return matchedRouteList;
}

function findNotFoundComponent(
  routes: Array<BasicRouterItem>,
  defaultNotFound: RouteComponent,
): RouteComponent {
  const notFoundRouteItem = routes.find((route) => route.path.includes("404"));

  if (notFoundRouteItem === undefined) {
    return defaultNotFound;
  }

  if (notFoundRouteItem.component === undefined) {
    return defaultNotFound;
  }

  return notFoundRouteItem.component;
}

interface RouterTableProps {
  flattenRouteList: Array<BasicRouterItem>;
  notFoundComponent: RouteComponent;
  originRouteList: Array<OriginNestedRouteItem>;
  customRender?: LubanRouterProps["children"];
}
const RouterTable: FunctionComponent<RouterTableProps> = ({
  flattenRouteList,
  notFoundComponent,
  customRender,
  originRouteList,
}) => {
  const matchedRouteList = useMatchedRouteList(flattenRouteList);

  const routerTable = createRouterTable(flattenRouteList, {
    NotFound: notFoundComponent,
    matchedRouteList,
    originRouteList,
  });


  let appRouter = <Switch>{routerTable}</Switch>;

  if (typeof customRender === "function") {
    appRouter = customRender({
      rendered: <Switch>{routerTable}</Switch>,
      matchedRouteList,
    });
  }

  return appRouter;
};

const LubanRouter: FunctionComponent<LubanRouterProps> = ({ config, children, originRouteList }) => {
  const { routes, basename = "/", hashType = "slash" } = config;

  let _mode = config.mode || "browser";

  if (window.__USE_SSR__ && _mode === "hash") {
    console.warn(
      "You can not use server side render and hash mode same time. Corrective mode by 'browser'",
    );
    _mode = "browser";
  }

  const notFoundComponent: RouteComponent = findNotFoundComponent(routes, DefaultNotFound);

  const hashRouterProps: HashRouterProps = { hashType, basename };

  const RouteTableProps: RouterTableProps = {
    flattenRouteList: routes,
    customRender: children,
    notFoundComponent,
    originRouteList,
  };

  return _mode === "browser" ? (
    <BrowserRouter basename={basename}>
      <RouterTable {...RouteTableProps} />
    </BrowserRouter>
  ) : (
    <HashRouter {...hashRouterProps}>
      <RouterTable {...RouteTableProps} />
    </HashRouter>
  );
};

export { LubanRouter };
