"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const leap_1 = require("./leap");
const airbnb_1 = require("./airbnb");
const standard_1 = require("./standard");
function default_1(api, options) {
    const lintFileSuffix = options.preset.language === "ts" ? "{ts,tsx}" : "{js,jsx}";
    if (api.isGitRepository()) {
        api.extendPackage({
            devDependencies: {
                husky: "^3.0.9",
                "lint-staged": "^9.4.3",
            },
            husky: {
                hooks: {
                    "pre-commit": "lint-staged",
                },
            },
            "lint-staged": {
                [`src/**/*.${lintFileSuffix}`]: [
                    "npm run eslint",
                    `npm run format:check:${options.preset.language}`,
                ],
            },
        });
    }
    if (options.preset.eslint === "leap") {
        leap_1.eslintConfigLeap(api);
        return;
    }
    if (options.preset.eslint === "airbnb") {
        airbnb_1.eslintConfigAirbnb(api, options);
        return;
    }
    if (options.preset.eslint === "standard") {
        standard_1.eslintConfigStandard(api, options);
        return;
    }
}
exports.default = default_1;
//# sourceMappingURL=generator.js.map