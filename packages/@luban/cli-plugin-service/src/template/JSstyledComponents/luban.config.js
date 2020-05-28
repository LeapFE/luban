const { createProjectConfig } = require("@luban-cli/cli-plugin-service");

module.exports = createProjectConfig({
  publicPath: process.env.APP_PUBLIC_PATH,
});
