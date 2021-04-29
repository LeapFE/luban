import { RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import { Config, Context as _Context } from "./store";
import { OriginRouteConfig } from "./definitions";

export interface EnhancedRouteComponentProps<
  M extends Record<PropertyKey, unknown> = {},
  Params extends { [K in keyof Params]?: string } = {},
  C extends StaticContext = StaticContext
> extends RouteComponentProps<Params, C> {
  meta?: M;
  name?: string;
}

export interface Context extends _Context {}

export function run(config: Config) {
  return config;
}

export function route(routeConfig: OriginRouteConfig) {
  return routeConfig;
}

interface Preload {
  default: ComponentType<any>;
}

export interface ClassComponent<OWN_PROPS = {}, INIT_PROPS = {}>
  extends React.ComponentClass<OWN_PROPS & INIT_PROPS> {
  getInitialProps?(context: Context): INIT_PROPS | Promise<INIT_PROPS>;
  preload?: () => Promise<Preload>;
}
export interface FunctionComponent<OWN_PROPS = {}, INIT_PROPS = {}>
  extends React.FunctionComponent<OWN_PROPS & INIT_PROPS> {
  getInitialProps?(context: Context): INIT_PROPS | Promise<INIT_PROPS>;
  preload?: () => Promise<Preload>;
}

export type ComponentType<P = {}, I = {}> = ClassComponent<P, I> | FunctionComponent<P, I>;

export declare type Page<OWN_PROPS = {}, INIT_PROPS = {}> = ComponentType<OWN_PROPS, INIT_PROPS>;
