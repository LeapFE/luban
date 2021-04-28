import { NestedRouteItem, BasicRouterItem } from "./definitions";

function flattenRoutes(routes: Array<NestedRouteItem>): Array<BasicRouterItem> {
  let routeList: Array<BasicRouterItem> = [];

  routes.forEach((route) => {
    routeList.push(route);

    if (Array.isArray(route.children) && route.children.length > 0) {
      routeList = routeList.concat(flattenRoutes(route.children));
    }
  });

  return routeList;
}

export { flattenRoutes };
