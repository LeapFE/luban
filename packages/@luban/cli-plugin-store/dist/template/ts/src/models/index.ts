import { init, RematchRootState, RematchDispatch } from "@rematch/core";

import { todo } from "./todo";

export const store = init({ models: { todo } });

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;

export interface RootModel {
  todo: typeof todo;
}
