import url from "url";
import { Application } from "express";
import * as PathRegexp from "path-to-regexp";
import { TokensToRegexpOptions, ParseOptions, Key } from "path-to-regexp";
import BodyParser from "body-parser";

import { MockConfig } from "../main";

function pathMatch(
  options: TokensToRegexpOptions & ParseOptions,
): (path: string) => (pathname: string) => Record<string, string> {
  options = options || {};

  return (path: string): ((pathname: string) => Record<string, string>) => {
    // `PathRegexp.pathToRegexp` will modify `keys`
    const keys: (Key & TokensToRegexpOptions & ParseOptions & { repeat: boolean })[] = [];

    const reg = PathRegexp.pathToRegexp(path, keys, options);

    return (pathname: string): Record<string, string> => {
      const m = reg.exec(pathname);
      const params = {};

      if (!m) {
        return params;
      }

      let key: Key & TokensToRegexpOptions & ParseOptions & { repeat: boolean };
      let param: string;
      let i: number = 0;

      for (i = 0; i < keys.length; i++) {
        key = keys[i];
        param = m[i + 1];

        if (!param) continue;

        params[key.name] = decodeURIComponent(param);

        if (key.repeat) {
          params[key.name] = params[key.name].split(key.delimiter);
        }
      }

      return params;
    };
  };
}

export function setupMockServer(app: Application, config: MockConfig): void {
  app.all("/*", (req, res, next) => {
    const matchedMockKey = Object.keys(config).find((k) => {
      return !!PathRegexp.pathToRegexp(k.replace(new RegExp("^" + req.method + " "), "")).exec(
        req.path,
      );
    });

    res.setHeader("Access-Control-Allow-Origin", req.get("Origin") || "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (matchedMockKey === undefined && req.method.toLocaleUpperCase() === "OPTIONS") {
      return res.sendStatus(200);
    } else if (typeof matchedMockKey === "string") {
      const mockValue = config[matchedMockKey];

      const contentType = req.get("Content-Type");
      let bodyParser = BodyParser.json();

      switch (contentType) {
        case "text/plain":
          bodyParser = BodyParser.raw();
          break;
        case "text/html":
          bodyParser = BodyParser.text();
          break;
        case "application/x-www-form-urlencoded":
          bodyParser = BodyParser.urlencoded({ extended: false });
          break;
      }

      bodyParser(req, res, function() {
        if (typeof mockValue === "function") {
          const rgxStr = ~matchedMockKey.indexOf(" ") ? " " : "";

          req.params = pathMatch({ sensitive: false, strict: false, end: false })(
            matchedMockKey.split(new RegExp(rgxStr))[1],
          )(url.parse(req.url).pathname || "");

          mockValue(req, res, next);
        } else {
          res.json(mockValue);
        }
      });
    } else {
      next();
    }
  });
}
