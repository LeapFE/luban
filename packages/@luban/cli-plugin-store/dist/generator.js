"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(api, options) {
    api.extendPackage({
        dependencies: {
            "react-redux": "^7.2.0",
            "@rematch/core": "^1.4.0",
        },
    });
    if (options.preset.language === "ts") {
        api.extendPackage({
            devDependencies: {
                "@types/react-redux": "^7.1.7",
            },
        });
        api.render("./template/ts", { useRouter: options.preset.router });
    }
    if (options.preset.language === "js") {
        api.render("./template/js", { useRouter: options.preset.router });
    }
}
exports.default = default_1;
//# sourceMappingURL=generator.js.map