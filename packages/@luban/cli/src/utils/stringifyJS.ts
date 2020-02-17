import { stringify } from "javascript-stringify";
import { Next } from "javascript-stringify/dist/types";

export const stringifyJS = function(value: any): string | undefined {
  return stringify(
    value,
    (val: any, space: string, next: Next) => {
      if (val && val.__expression) {
        return val.__expression;
      }
      return next(val);
    },
    2,
  );
};
