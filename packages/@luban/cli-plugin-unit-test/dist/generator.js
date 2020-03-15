"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(api, options) {
    api.extendPackage({
        scripts: {
            test: "jest",
            "test:update": "jest -u",
            "test:coverage": "jest --coverage --color",
        },
        devDependencies: {
            enzyme: "^3.11.0",
            "enzyme-adapter-react-16": "^1.15.2",
            jest: "^25.1.0",
            "enzyme-to-json": "^3.4.4",
        },
    });
    if (options.preset.language === "ts") {
        api.extendPackage({
            devDependencies: {
                "@types/enzyme": "^3.10.5",
                "@types/enzyme-adapter-react-16": "^1.0.6",
                "@types/jest": "^25.1.4",
                "@types/enzyme-to-json": "^1.5.3",
                "ts-jest": "^25.2.1",
            },
        });
    }
    if (options.preset.language === "js") {
        api.extendPackage({
            devDependencies: {
                "babel-jest": "^25.1.0",
            },
        });
    }
    const coveragePathIgnorePatterns = ["/node_modules/"];
    const testFileSuffix = options.preset.language === "ts" ? "{ts,tsx}" : "{js,jsx}";
    if (options.preset.router) {
        coveragePathIgnorePatterns.push("/src/router/");
    }
    if (options.preset.store) {
        coveragePathIgnorePatterns.push("/src/models/");
    }
    api.render("./template", {
        isTsProject: options.preset.language === "ts",
        coveragePathIgnorePatterns: JSON.stringify(coveragePathIgnorePatterns),
        testFileSuffix,
    });
}
exports.default = default_1;
//# sourceMappingURL=generator.js.map