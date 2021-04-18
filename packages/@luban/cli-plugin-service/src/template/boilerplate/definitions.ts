// Type definitions for LubanRouter 1.2.0
// Project: https://github.com/LeapFE/luban-router
// Definitions by: front-end-captain <https://github.com/LeapFE>
// TypeScript Version: 3.8.3

import { ReactElement } from "react";
import { RouteComponentProps } from "react-router-dom";
// eslint-disable-next-line import/no-extraneous-dependencies
import { StaticContext } from "react-router";

import { ComponentType } from "./index";

export interface EnhancedRouteComponentProps<
  M extends Record<PropertyKey, unknown> = {},
  Params extends { [K in keyof Params]?: string } = {},
  C extends StaticContext = StaticContext
> extends RouteComponentProps<Params, C> {
  meta?: M;
  name?: string;
}

export type RouteMetaData = Record<string | number | symbol, unknown>;

export type DefaultRouteProps = { meta?: RouteMetaData } & RouteComponentProps<any> & {
    name?: string;
  };

export type RouteComponent<P extends DefaultRouteProps = any> = ComponentType<P>;

/**
 * @description uses the HTML5 history API or uses the hash portion of the URL
 */
export type RouteMode = "browser" | "hash";

/**
 * @description The type of encoding to use for window.location.hash.
 */
export type HashType = "slash" | "noslash" | "hashbang";

/**
 * @description user role of application
 */
export type Role = string | number | Array<string | number>;

export type Authority = Array<string | number>;

export interface RouteConfig {
  /**
   * @description uses the HTML5 history API or uses the hash portion of the URL
   * @type {string}
   * @default {string} "browser"
   */
  mode?: RouteMode;
  /**
   * @description The base URL for all locations.
   * @type {string}
   * @default {string} "/"
   */
  basename?: string;
  /**
   * @description The type of encoding to use for window.location.hash.
   * @see https://reacttraining.com/react-router/web/api/HashRouter/hashtype-string
   *  Available values are:
   * + "slash" - Creates hashes like #/ and #/sunshine/lollipops
   * + "noslash" - Creates hashes like # and #sunshine/lollipops
   * + "hashbang" - Creates “ajax crawlable” (deprecated by Google) hashes like #!/ and #!/sunshine/lollipops
   *
   * @type {"slash" | "noslash" | "hashbang"}
   * @default {string} "slash"
   */
  hashType?: HashType;
  /**
   * @description route table config
   * @type {Array}
   */
  routes: Array<NestedRouteItem>;

  /** A fallback react tree to show when a Suspense child suspends */
  fallback?: string;
}

export interface OriginRouteConfig extends Omit<RouteConfig, "routes"> {
  routes: Array<OriginNestedRouteItem>;
}

export interface BasicRouterItem {
  /**
   * @description route name
   * @type {string}
   * @default {string} ""
   */
  name?: string;

  /**
   * @description route path
   * @type {string}
   */
  path: string;

  /**
   * @description redirect path
   * @type string
   */
  redirect?: string;

  /**
   * @description When true, will only match if the path matches the location.pathname exactly
   * @type {boolean}
   * @default {boolean} true
   */
  exact?: boolean;

  /**
   * @description When true, a path that has a trailing slash will only match a location.pathname with a trailing slash.
   * @type {boolean}
   * @default {boolean} false
   */
  strict?: boolean;

  /**
   * @description path to rendered view component
   * @type {ComponentType<RouteComponentProps<Record<string, string>>> | ComponentType}
   * @default {} () => null;
   */
  component?: RouteComponent;

  /**
   * @description roles that can access this route
   * if this value is undefined, mean all role can access this route
   * if this value is empty array, mean any role can't access this route
   *
   * @type {Array<string | number>}
   * @default {Array} []
   */
  authority?: Authority;

  /**
   * @description redirect path when access no authority route
   * if this value is undefined, will redirect to 404 page when access route
   * @type {string | Function}
   */
  unAuthorityPath?: string | ((role: Role) => string);

  /**
   * @description this route's icon
   * @type {string}
   */
  icon?: string;

  /**
   * @description route meta data, will pass to route component props
   */
  meta?: RouteMetaData;
}

export interface NestedRouteItem extends BasicRouterItem {
  /**
   * @description this route's child route
   */
  children?: Array<NestedRouteItem>;
}

export interface OriginNestedRouteItem extends Omit<BasicRouterItem, "component"> {
  component?: string;
  /**
   * @description this route's child route
   */
  children?: Array<OriginNestedRouteItem>;
}

export interface MatchedRouterItem extends BasicRouterItem {
  active: boolean;
}

type customRendererParams = {
  /**
   * @description rendered router table, can use it directly
   */
  renderedTable: ReactElement;
  /**
   * @description route list that matched with current path
   */
  matchedRouteList: Array<MatchedRouterItem>;
  /**
   * @description route list that current role can visit
   */
  permissionRouteList: Array<NestedRouteItem>;
};

export interface CustomRenderer {
  (params: customRendererParams): ReactElement;
}

export interface CustomCheckAuthority {
  (role: Role, authority?: Authority | undefined): boolean;
}

export interface LubanRouterProps {
  // route config
  config: RouteConfig;
  // role of app
  role?: Role;
  // custom render callback. implement app layout、nav、breadcrumbs and so on
  children?: CustomRenderer;
  // custom authority checker
  customCheckAuthority?: CustomCheckAuthority;
}
