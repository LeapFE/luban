const allowInjectedEnvNamePrefixReg = /^APP_/;

export function resolveClientEnv(
  publicPath: string,
): Record<"process.env", Record<string, string>> | Record<string, string> {
  const env: Record<string, string> = {};

  Object.keys(process.env).forEach((key) => {
    if (allowInjectedEnvNamePrefixReg.test(key) || key === "NODE_ENV") {
      env[key] = process.env[key] || "";
    }
  });

  env.BASE_URL = publicPath;

  for (const key in env) {
    env[key] = JSON.stringify(env[key]);
  }

  return {
    "process.env": env,
  };
}
