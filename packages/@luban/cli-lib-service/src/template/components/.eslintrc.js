const path = require("path");

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: { project: [path.resolve(__dirname, "../tsconfig.json")] },
  extends: ["leap"],
  env: { es2017: true },
};
