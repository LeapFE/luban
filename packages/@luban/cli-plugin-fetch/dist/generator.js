"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(api, options) {
    api.extendPackage({
        dependencies: {
            axios: "^0.19.2",
        },
    });
    if (options.preset.language === "ts") {
        api.extendPackage({
            devDependencies: {
                "@types/axios": "^0.14.0",
            },
        });
    }
    if (options.preset.language === "js") {
        api.render("./template/js");
    }
    if (options.preset.language === "ts") {
        api.render("./template/ts");
    }
}
exports.default = default_1;
//# sourceMappingURL=generator.js.map