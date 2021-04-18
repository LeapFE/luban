import { GeneratorAPI } from "@luban-cli/cli-shared-types/dist/cli/lib/generator/generatorAPI";
import { RootOptions } from "@luban-cli/cli-shared-types/dist/shared";

export default function (api: GeneratorAPI, options: Required<RootOptions>): void {
  const collectCoverageFrom: string[] = [];

  api.extendPackage({
    scripts: {
      test: "jest",
      "test:update": "jest -u",
      "test:coverage": "jest --coverage --color",
    },
    dependencies: {
      classnames: "^2.2.6",
    },
    devDependencies: {
      "@types/classnames": "^2.2.11",
      "@types/enzyme": "^3.10.5",
      "@types/enzyme-adapter-react-16": "^1.0.6",
      "@types/jest": "^25.1.4",
      "@types/enzyme-to-json": "^1.5.3",
      "@types/react-test-renderer": "^16.9.3",
      enzyme: "^3.11.0",
      "enzyme-adapter-react-16": "^1.15.2",
      jest: "^25.1.0",
      "enzyme-to-json": "^3.4.4",
      "react-test-renderer": "^16.14.0",
      "ts-jest": "^25.2.1",
    },
  });

  if (options.type === "lib") {
    api.extendPackage({
      devDependencies: {
        "babel-jest": "^25.1.0",
      },
    });
  }

  const coveragePathIgnorePatterns: string[] = ["/src/typings/"];
  const testFileSuffix = "{ts,tsx}";
  const testRegex = ".*\\.test\\.tsx?$";

  if (options.type === "web") {
    coveragePathIgnorePatterns.push("/src/.luban/");
  }

  if (options.fetch) {
    coveragePathIgnorePatterns.push("/src/service/");
  }

  if (options.type === "lib") {
    collectCoverageFrom.push(
      "components/**/*.{ts,tsx}",
      "!components/*/style/index.tsx",
      "!components/style/index.tsx",
      "!components/*/locale/index.tsx",
      "!components/*/__tests__/type.test.tsx",
      "!components/**/*/interface.{ts,tsx}",
    );
  } else {
    collectCoverageFrom.push(`src/**/*.${testFileSuffix}`);
  }

  api.render("./template", {
    coveragePathIgnorePatterns: JSON.stringify(coveragePathIgnorePatterns),
    testRegex,
    collectCoverageFrom: JSON.stringify(collectCoverageFrom),
    isLib: options.type === "lib",
  });
}
