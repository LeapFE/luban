import { NestedRouteItem, Role, BasicRouterItem } from "./definitions";

function checkAuthority(role: Role, authority?: Array<string | number>): boolean {
  if (typeof authority === "undefined") {
    return true;
  }

  if (Array.isArray(role)) {
    const roleSet = new Set(role);
    return authority.filter((item) => roleSet.has(item)).length > 0;
  }

  return authority.includes(role);
}

function filterUnPermissionRoute(
  routes: Array<NestedRouteItem>,
  role: Role,
): Array<NestedRouteItem> {
  return routes.filter((route) => {
    if (route.path.includes("404")) {
      return false;
    }

    if (Array.isArray(route.children) && route.children.length > 0) {
      route.children = filterUnPermissionRoute(route.children, role);
    }

    return checkAuthority(role, route.authority);
  });
}

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

export { flattenRoutes, checkAuthority, filterUnPermissionRoute };
