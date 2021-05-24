import { createProjectConfig } from "@luban-cli/cli-plugin-service";

export default createProjectConfig({
  publicPath: process.env.APP_PUBLIC_PATH,
});
