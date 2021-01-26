module.exports = {
  verbose: true,
  <%_ if (isTsProject) { _%>
  preset: "ts-jest",
  transform: { "\\.tsx?$": "@luban-cli/cli-lib-service/preprocessor" },
  <%_ } else { _%>
  transform: { "^.+\\.jsx?$": "babel-jest" },
  <%_ } _%>
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "md"],
  testRegex: "<%- testRegex %>"",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  transformIgnorePatterns: ["node_modules/[^/]+?/(?!(es|node_modules)/)", "/dist/"],
  collectCoverageFrom:  <%- collectCoverageFrom %>,
  coveragePathIgnorePatterns: <%- coveragePathIgnorePatterns %>,
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/tests/fileMock.js",
    "\\.(css|less)$": "<rootDir>/tests/styleMock.js",
    "\\.\\/style$": "<rootDir>/tests/styleMock.js",
  },
};
