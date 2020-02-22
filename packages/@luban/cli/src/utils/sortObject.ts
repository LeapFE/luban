export const sortObject = function<T extends Record<string, any>>(
  obj: T,
  keyOrder?: Array<keyof T>,
  notSortByUnicode?: boolean,
): T {
  const res: Record<keyof T, any> = Object.create({});

  if (keyOrder) {
    keyOrder.forEach((key) => {
      if (obj.hasOwnProperty(key)) {
        res[key] = obj[key];
        delete obj[key];
      }
    });
  }

  const keys: Array<keyof T> = Object.keys(obj);

  !notSortByUnicode && keys.sort();
  keys.forEach((key) => {
    res[key] = obj[key];
  });

  return res;
};
