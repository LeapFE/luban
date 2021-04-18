import React, { FunctionComponent } from "react";
import { Switch, BrowserRouter, HashRouter, HashRouterProps, useLocation } from "react-router-dom";
import { pathToRegexp } from "path-to-regexp";

import { filterUnPermissionRoute } from "./util";
import { createRouterTable } from "./createRouterTable";
import { DefaultNotFound } from "./defaultNotfound";

import {
  LubanRouterProps,
  RouteComponent,
  BasicRouterItem,
  Role,
  MatchedRouterItem,
  CustomCheckAuthority,
  NestedRouteItem,
} from "./definitions";

function useMatchedRouteList(routeList: Array<BasicRouterItem>): Array<MatchedRouterItem> {
  const { pathname } = useLocation();

  let pathSnippets = pathname.split("/").filter((p) => !!p);

  if (pathname !== "/") {
    pathSnippets = pathname.split("/").filter((i) => i);
  }

  const matchedRouteList: Array<MatchedRouterItem> = [];

  pathSnippets.forEach((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;

    const targetRoute = routeList.find((route) => {
      return pathToRegexp(route.path, [], { strict: false }).test(url);
    });

    if (targetRoute) {
      matchedRouteList.push({
        name: targetRoute.name,
        path: targetRoute.path,
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
  role?: Role;
  customRender?: LubanRouterProps["children"];
  customCheckAuthority?: CustomCheckAuthority;
}
const RouterTable: FunctionComponent<RouterTableProps> = ({
  flattenRouteList,
  notFoundComponent,
  role,
  customRender,
  customCheckAuthority,
}) => {
  const routerTable = createRouterTable(flattenRouteList, {
    role,
    NotFound: notFoundComponent,
    customCheckAuthority,
  });

  const matchedRouteList = useMatchedRouteList(flattenRouteList);

  let appRouter = <Switch>{routerTable}</Switch>;

  let permissionRouteList: Array<NestedRouteItem> = flattenRouteList;
  if (role) {
    permissionRouteList = filterUnPermissionRoute(flattenRouteList, role);
  }

  if (typeof customRender === "function") {
    appRouter = customRender({
      renderedTable: <Switch>{routerTable}</Switch>,
      matchedRouteList,
      permissionRouteList,
    });
  }

  return appRouter;
};

const LubanRouter: FunctionComponent<LubanRouterProps> = ({
  config,
  role,
  children,
  customCheckAuthority,
}) => {
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
    role,
    notFoundComponent,
    customCheckAuthority,
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
