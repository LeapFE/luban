"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(api, options) {
    api.render("./../../../template/typescript");
    if (options.preset.cssPreprocessor === "styled-components") {
        api.extendPackage({
            devDependencies: {
                "@types/styled-components": "^4.4.0",
            },
        });
    }
    api.extendPackage({
        devDependencies: {
            "@types/react": "^16.9.11",
            "@types/react-dom": "^16.9.4",
            typescript: "^3.7.2",
        },
    });
}
exports.default = default_1;
//# sourceMappingURL=generator.js.map