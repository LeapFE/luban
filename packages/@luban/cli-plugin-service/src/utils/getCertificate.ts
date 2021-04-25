import path from "path";
import fs from "fs-extra";

export function getCertificate(context: string) {
  const certificatePath = path.join(context, "node_modules/webpack-dev-server/ssl/server.pem");

  return fs.readFileSync(certificatePath);
}
