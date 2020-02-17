"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortObject = function (obj, keyOrder, dontSortByUnicode) {
    const res = Object.create({});
    if (keyOrder) {
        keyOrder.forEach((key) => {
            if (obj.hasOwnProperty(key)) {
                res[key] = obj[key];
                delete obj[key];
            }
        });
    }
    const keys = Object.keys(obj);
    !dontSortByUnicode && keys.sort();
    keys.forEach((key) => {
        res[key] = obj[key];
    });
    return res;
};
//# sourceMappingURL=sortObject.js.map