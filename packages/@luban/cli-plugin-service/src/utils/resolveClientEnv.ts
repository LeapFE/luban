const allowInjectedEnvNamePrefixReg = /^APP_/;

export function resolveClientEnv(publicPath: string, raw?: boolean): Record<string, any> {
  const env: Record<string, any> = {};

  Object.keys(process.env).forEach((key) => {
    if (allowInjectedEnvNamePrefixReg.test(key) || key === "NODE_ENV") {
      env[key] = process.env[key];
    }
  });

  env.BASE_URL = publicPath;

  if (raw) {
    return env;
  }

  for (const key in env) {
    env[key] = JSON.stringify(env[key]);
  }
  return {
    "process.env": env,
  };
}
