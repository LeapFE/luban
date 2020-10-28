export const sortObject = function<T extends Record<string, unknown>>(
  obj: T,
  keyOrder?: Array<string>,
  notSortByUnicode?: boolean,
): T {
  const res: Record<string, unknown> = Object.create({});

  if (keyOrder) {
    keyOrder.forEach((key) => {
      if (obj.hasOwnProperty(key)) {
        res[key] = obj[key];
        delete obj[key];
      }
    });
  }

  const keys = Object.keys(obj);

  !notSortByUnicode && keys.sort();

  keys.forEach((key) => {
    res[key] = obj[key];
  });

  return res as T;
};
