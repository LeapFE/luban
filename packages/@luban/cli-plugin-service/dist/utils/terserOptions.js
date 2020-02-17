"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.terserOptions = function (options) {
    return {
        terserOptions: {
            compress: {
                arrows: false,
                collapse_vars: false,
                comparisons: false,
                hoist_funs: false,
                hoist_props: false,
                hoist_vars: false,
                inline: false,
                loops: false,
                negate_iife: false,
                properties: false,
                reduce_funcs: false,
                reduce_vars: false,
                switches: false,
                toplevel: false,
                typeofs: false,
                booleans: true,
                if_return: true,
                sequences: true,
                unused: true,
                conditionals: true,
                dead_code: true,
                evaluate: true,
            },
            mangle: {
                safari10: true,
            },
        },
        sourceMap: options.productionSourceMap,
        cache: true,
        extractComments: false,
    };
};
//# sourceMappingURL=terserOptions.js.map