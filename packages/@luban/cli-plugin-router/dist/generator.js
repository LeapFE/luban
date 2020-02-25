"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(api, options) {
    if (options.preset.router) {
        api.extendPackage({
            dependencies: {
                "luban-router": "0.0.6",
            },
        });
        if (options.preset.language === "js") {
            api.render("./template");
        }
        if (options.preset.language === "ts") {
            api.render("./template/ts");
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=generator.js.map