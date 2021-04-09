// more information see https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-d-ts.html

declare namespace NodeJS {
  interface ProcessEnv extends Dict<string> {
    AFFECT_FOR_ALL_ENV: string;
    APP_SERVER: string;
    APP_PUBLIC_PATH: string;
    NODE_ENV: "development" | "production";
  }
}
