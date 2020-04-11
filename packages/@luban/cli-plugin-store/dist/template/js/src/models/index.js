import { init } from "@rematch/core";

import { todo } from "./todo";

export const store = init({ models: { todo } });
