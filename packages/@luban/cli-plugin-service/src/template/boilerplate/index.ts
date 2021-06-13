import { ReactElement } from "react";
import { RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import { Config, Context as _Context } from "./store";
import { OriginRouteConfig, ExtraPageProps, CustomRendererParams, OriginNestedRouteItem } from "./definitions";

export interface EnhancedRouteComponentProps<
  M extends Record<PropertyKey, unknown> = {},
  Params extends { [K in keyof Params]?: string } = {},
  C extends StaticContext = StaticContext
> extends RouteComponentProps<Params, C>, ExtraPageProps {
  meta?: M;
  name?: string;
  initialing: boolean | null;
}

export interface PreparerProps {
  initialing: boolean | null;
}

export interface LayoutProps extends Omit<CustomRendererParams, "rendered"> {
  originRouteList: Array<OriginNestedRouteItem>;
  children: ReactElement;
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
  /**
   * @description initial props for this component, return or resolve data will inject this component by props
   * @param context you can access path, store, query and so on through context
   * @param shared you can mutate this object that can shared it in each page
   */
  getInitialProps?(
    context: Context,
    shared: Record<PropertyKey, unknown>,
  ): INIT_PROPS | Promise<INIT_PROPS>;
  preload?: () => Promise<Preload>;
}
export interface FunctionComponent<OWN_PROPS = {}, INIT_PROPS = {}>
  extends React.FunctionComponent<OWN_PROPS & INIT_PROPS> {
  /**
   * @description initial props for this component, return or resolve data will inject this component by props
   * @param context you can access path, store, query and so on through context
   * @param shared you can mutate this object that can shared it in each page
   */
  getInitialProps?(
    context: Context,
    shared: Record<PropertyKey, unknown>,
  ): INIT_PROPS | Promise<INIT_PROPS>;
  preload?: () => Promise<Preload>;
}

export type ComponentType<P = {}, I = {}> = ClassComponent<P, I> | FunctionComponent<P, I>;

export declare type Page<OWN_PROPS = {}, INIT_PROPS = {}> = ComponentType<OWN_PROPS, INIT_PROPS>;
