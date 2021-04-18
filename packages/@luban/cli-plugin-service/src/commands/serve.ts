import { PluginAPI } from "./../lib/PluginAPI";
import { ServeCliArgs, ParsedArgs } from "./../definitions";
import { ProjectConfig } from "./../main";

import { Serve } from "../lib/Serve";

const defaultServerConfig = {
  host: "0.0.0.0",
  port: 8080,
  https: false,
};

export default function (api: PluginAPI, options: ProjectConfig): void {
  api.registerCommand(
    "serve",
    {
      description: "start development server",
      usage: "luban-cli-service serve [options]",
      options: {
        "--config": "specify config file",
        "--open": `open browser on server start`,
        "--mode": `specify env mode (default: development)`,
        "--host": `specify host (default: ${defaultServerConfig.host})`,
        "--port": `specify port (default: ${defaultServerConfig.port})`,
        "--https": `use https (default: ${defaultServerConfig.https})`,
        "--public": `specify the public network URL for the HMR client`,
      },
    },
    async (args: ParsedArgs<ServeCliArgs>) => {
      const serve = new Serve(api, options, args);
      await serve.start();
    },
  );
}
