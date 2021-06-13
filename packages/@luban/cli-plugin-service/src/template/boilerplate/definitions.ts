import { ReactElement } from "react";
import { RouteComponentProps } from "react-router-dom";

import { ComponentType } from "./index";

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

export interface CustomRendererParams {
  /**
   * @description rendered router table, can use it directly
   */
  rendered: ReactElement;
  /**
   * @description route list that matched with current path
   */
  matchedRouteList: Array<MatchedRouterItem>;

}

export interface ExtraPageProps {
  matchedRouteList: Array<MatchedRouterItem>;
  originRouteList: Array<OriginNestedRouteItem>;
}


export interface CustomRenderer {
  (params: CustomRendererParams): ReactElement;
}

export interface LubanRouterProps {
  // route config
  config: RouteConfig;
  originRouteList: Array<OriginNestedRouteItem>;
  // custom render callback. implement app layout、nav、breadcrumbs and so on
  children?: CustomRenderer;
}
