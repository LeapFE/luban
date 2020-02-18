"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(api, options) {
    const isTSProject = !!options.preset.plugins["cli-plugin-typescript"];
    const eslintParser = isTSProject ? "@typescript-eslint/parser" : "babel-eslint";
    let parserOptions = {};
    let eslintRules = {};
    const eslintExtends = [
        "eslint:recommended",
        "plugin:react/recommended",
        "prettier",
        "prettier/react",
    ];
    const eslintPlugins = ["react-hooks"];
    if (isTSProject) {
        api.extendPackage({
            scripts: {
                eslint: "eslint --config .eslintrc --ext .tsx,.ts src/",
                check: "tsc",
                format: "prettier --write src/**/*.{ts,tsx}",
                "check-format": "prettier --check src/**/*.{ts,tsx}",
            },
            devDependencies: {
                "@typescript-eslint/parser": "^2.7.0",
                "@typescript-eslint/eslint-plugin": "^2.7.0",
            },
        });
        parserOptions = {
            ecmaVersion: 11,
            sourceType: "module",
            ecmaFeatures: {
                jsx: true,
            },
            project: "./tsconfig.json",
            tsconfigRootDir: "./",
        };
        eslintPlugins.push("@typescript-eslint");
        eslintExtends.push("prettier/@typescript-eslint", "plugin:@typescript-eslint/recommended-requiring-type-checking", "plugin:@typescript-eslint/recommended", "plugin:@typescript-eslint/eslint-recommended");
    }
    else {
        api.extendPackage({
            scripts: {
                eslint: "eslint --config .eslintrc --ext .jsx,.js src/",
                format: "prettier --write src/**/*.{js,jsx}",
                "check-format": "prettier --check src/**/*.{js,jsx}",
            },
            devDependencies: {
                "babel-eslint": "^10.0.3",
            },
        });
        parserOptions = {
            ecmaVersion: 11,
            sourceType: "module",
            ecmaFeatures: {
                jsx: true,
            },
        };
    }
    const lintFileSuffix = isTSProject ? "src/**/*.{ts,tsx}" : "src/**/*.{js,jsx}";
    api.extendPackage({
        devDependencies: {
            eslint: "^6.6.0",
            "eslint-config-prettier": "^6.6.0",
            "babel-plugin-transform-react-remove-prop-types": "^0.4.24",
            "eslint-plugin-react": "^7.16.0",
            "eslint-plugin-react-hooks": "^2.3.0",
            "stylelint-webpack-plugin": "^1.1.0",
        },
    });
    if (!isTSProject) {
        api.extendPackage({
            dependencies: {
                "prop-types": "^15.7.2",
            },
        });
    }
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
                [lintFileSuffix]: ["npm run eslint", "npm run check-format", "git add"],
            },
        });
    }
    const eslintConfig = options.preset.plugins["cli-plugin-eslint"]
        ? options.preset.plugins["cli-plugin-eslint"].config
        : "base";
    if (eslintConfig === "base") {
        if (isTSProject) {
            eslintRules = {
                "react/display-name": ["warn"],
                "react/prop-types": "off",
            };
        }
        else {
            eslintRules = {
                "react/display-name": ["warn"],
            };
        }
    }
    if (eslintConfig === "standard") {
        api.extendPackage({
            devDependencies: {
                "eslint-config-standard": "^14.1.0",
                "eslint-plugin-import": "^2.18.2",
                "eslint-plugin-node": "^10.0.0",
                "eslint-plugin-promise": "^4.2.1",
                "eslint-plugin-standard": "^4.0.1",
            },
        });
        eslintExtends.push("standard", "prettier/standard");
        if (isTSProject) {
            eslintRules = {
                quotes: ["error", "double"],
                semi: ["error", "always"],
                "space-before-function-paren": ["error", "never"],
                "comma-dangle": ["error", "always-multiline"],
                "react/prop-types": "off",
            };
        }
        else {
            eslintRules = {
                quotes: ["error", "double"],
                semi: ["error", "always"],
                "space-before-function-paren": ["error", "never"],
                "comma-dangle": ["error", "always-multiline"],
            };
        }
    }
    if (eslintConfig === "airbnb") {
        api.extendPackage({
            devDependencies: {
                "eslint-config-airbnb": "^18.0.1",
                "eslint-plugin-jsx-a11y": "^6.2.3",
                "eslint-plugin-import": "^2.18.2",
            },
        });
        eslintExtends.push("airbnb");
        if (isTSProject) {
            eslintRules = {
                "react/display-name": ["warn"],
                "react/prop-types": ["off"],
                "import/no-unresolved": ["off"],
                "react/jsx-filename-extension": ["error", { extensions: [".ts", ".tsx"] }],
                "import/prefer-default-export": ["off"],
                "react/state-in-constructor": ["warn"],
                "no-unused-vars": ["error"],
                quotes: ["error", "double"],
            };
        }
        else {
            eslintRules = {
                "react/display-name": ["warn"],
                "import/no-unresolved": ["off"],
                "react/jsx-filename-extension": ["error", { extensions: [".js", ".jsx"] }],
                "import/prefer-default-export": ["off"],
                "react/state-in-constructor": ["warn"],
                "no-unused-vars": ["error"],
                quotes: ["error", "double"],
            };
        }
    }
    api.render("./../../../template/eslint", {
        eslintExtends: JSON.stringify(eslintExtends),
        eslintPlugins: JSON.stringify(eslintPlugins),
        parserOptions: JSON.stringify(parserOptions),
        eslintParser: JSON.stringify(eslintParser),
        eslintRules: JSON.stringify(eslintRules),
    });
}
exports.default = default_1;
//# sourceMappingURL=generator.js.map