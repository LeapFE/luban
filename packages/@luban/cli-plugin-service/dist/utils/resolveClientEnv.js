"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prefixRE = /^APP_/;
function resolveClientEnv(options, raw) {
    const env = {};
    Object.keys(process.env).forEach((key) => {
        if (prefixRE.test(key) || key === "NODE_ENV") {
            env[key] = process.env[key];
        }
    });
    env.BASE_URL = options.publicPath;
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
exports.resolveClientEnv = resolveClientEnv;
//# sourceMappingURL=resolveClientEnv.js.map