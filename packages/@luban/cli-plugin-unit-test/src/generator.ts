import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/lib/generator/generatorAPI";
import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

export default function(api: GeneratorAPI, options: Required<RootOptions>): void {
  const collectCoverageFrom: string[] = [];

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
      "react-test-renderer": "^16.14.0",
    },
  });

  if (options.language === "ts") {
    api.extendPackage({
      devDependencies: {
        "@types/enzyme": "^3.10.5",
        "@types/enzyme-adapter-react-16": "^1.0.6",
        "@types/jest": "^25.1.4",
        "@types/enzyme-to-json": "^1.5.3",
        "ts-jest": "^25.2.1",
        "@types/react-test-renderer": "^16.9.3",
      },
    });
  }

  if (options.language === "js" || options.isLib) {
    api.extendPackage({
      devDependencies: {
        "babel-jest": "^25.1.0",
      },
    });
  }

  const coveragePathIgnorePatterns: string[] = ["/node_modules/"];
  const testFileSuffix = options.language === "ts" ? "{ts,tsx}" : "{js,jsx}";
  const testRegex = options.language === "ts" ? ".*\\.test\\.tsx?$" : ".*\\.test\\.jsx?$";

  if (options.router) {
    coveragePathIgnorePatterns.push("/src/router/");
  }

  if (options.store) {
    coveragePathIgnorePatterns.push("/src/models/");
  }

  if (options.isLib) {
    collectCoverageFrom.concat([
      "components/**/*.{ts,tsx}",
      "!components/*/style/index.tsx",
      "!components/style/index.tsx",
      "!components/*/locale/index.tsx",
      "!components/*/__tests__/type.test.tsx",
      "!components/**/*/interface.{ts,tsx}",
    ]);
  } else {
    collectCoverageFrom.concat([`src/**/*.${testFileSuffix}`]);
  }

  api.render("./template", {
    isTsProject: options.language === "ts",
    coveragePathIgnorePatterns: JSON.stringify(coveragePathIgnorePatterns),
    testRegex,
    collectCoverageFrom: JSON.stringify(collectCoverageFrom),
  });
}
