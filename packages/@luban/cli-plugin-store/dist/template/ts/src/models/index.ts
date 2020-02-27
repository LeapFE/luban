import { todo } from "./todo";

// no need to extend from Models
export interface RootModel {
  todo: typeof todo;
}

export const models: RootModel = { todo };
