declare module "preload-webpack-plugin";

declare module "cliui";

declare module "ansi-html";

declare module "webpack/lib/HashedModuleIdsPlugin" {
  import webpack from "webpack";

  export default webpack.HashedModuleIdsPlugin;
}

declare module "webpack/lib/DefinePlugin" {
  import webpack from "webpack";

  export default webpack.DefinePlugin;
}
