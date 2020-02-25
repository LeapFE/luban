"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const javascript_stringify_1 = require("javascript-stringify");
exports.stringifyJS = function (value) {
    return javascript_stringify_1.stringify(value, (val, space, next) => {
        if (val && val.__expression) {
            return val.__expression;
        }
        return next(val);
    }, 2);
};
//# sourceMappingURL=stringifyJS.js.map