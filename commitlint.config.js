module.exports = {
  extends: ['@commitlint/config-lerna-scopes', "@commitlint/config-conventional"],
  rules: {
    "subject-max-length": [2, "always", [80]],
  },
};
