/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { transformFileSync } from "@babel/core";
import generator from "@babel/generator";
import traverse from "@babel/traverse";
import type = require("@babel/types");

// TODO review type error

async function getAst(sourceFile: string) {
  let result = null;

  try {
    result = await transformFileSync(sourceFile, {
      ast: true,
      sourceType: "module",
      presets: ["@babel/preset-typescript"],
    });
  } catch (e) {
    console.log(e);
  }

  return result?.ast;
}

function produceOriginRoute(ast: type.File): type.Node {
  let originRouteNode = null;

  // @ts-ignore
  traverse(ast, {
    ObjectProperty(path) {
      const key = path.node.key as type.Identifier;

      if (key.name === "routes" && type.isArrayExpression(path.node.value)) {
        originRouteNode = path.node.value;
      }
    },
  });

  const staticRouteNodeDeclaration = type.variableDeclaration("const", [
    type.variableDeclarator(type.identifier("originRoute"), originRouteNode),
  ]);

  const exportDefaultDeclaration = type.exportDefaultDeclaration(type.identifier("originRoute"));

  const _ast: type.Program = {
    type: "Program",
    body: [staticRouteNodeDeclaration, exportDefaultDeclaration],
    directives: [],
    sourceFile: "",
    sourceType: "module",
    leadingComments: null,
    innerComments: null,
    trailingComments: null,
    loc: null,
    start: null,
    end: null,
    interpreter: null,
  };

  return _ast;
}

function produceStaticRoute(ast: type.File): type.Node {
  let staticRouteNode = null;

  const importComponentDeclaration: type.ImportDeclaration[] = [];

  // @ts-ignore
  traverse(ast, {
    ObjectProperty(path) {
      const key = path.node.key as type.Identifier;

      if (key.name === "component" && type.isStringLiteral(path.node.value)) {
        const _path = path.node.value.value;
        const pathItem = path.node.value.value.split("/");
        const name = pathItem[pathItem.length - 1].toUpperCase();

        // @ts-ignore
        path.node.value = type.identifier(name);

        importComponentDeclaration.push(
          type.importDeclaration(
            [type.importDefaultSpecifier(type.identifier(name))],
            type.stringLiteral(_path),
          ),
        );
      }
      if (key.name === "routes" && type.isArrayExpression(path.node.value)) {
        staticRouteNode = path.node.value;
      }
    },
  });

  const staticRouteNodeDeclaration = type.variableDeclaration("const", [
    type.variableDeclarator(type.identifier("staticRoute"), staticRouteNode),
  ]);

  const exportDefaultDeclaration = type.exportDefaultDeclaration(type.identifier("staticRoute"));

  const _ast: type.Program = {
    type: "Program",
    body: [...importComponentDeclaration, staticRouteNodeDeclaration, exportDefaultDeclaration],
    directives: [],
    sourceFile: "",
    sourceType: "module",
    leadingComments: null,
    innerComments: null,
    trailingComments: null,
    loc: null,
    start: null,
    end: null,
    interpreter: null,
  };

  return _ast;
}

function produceDynamicRoute(ast: type.File): type.Program {
  let dynamicRouteNode = null;

  let declareFallbackOption = false;
  let userFallbackPath = "";

  // @ts-ignore
  traverse(ast, {
    ObjectProperty(path) {
      const key = path.node.key as type.Identifier;

      if (key.name === "component" && type.isStringLiteral(path.node.value)) {
        const componentPath = path.node.value.value;
        let routePath = "";

        if (Array.isArray(path.container)) {
          // @ts-ignore
          const node = path.container.find((c) => c.key.name === "path");
          // @ts-ignore
          routePath = node.value.value;
        }

        const pathSnippets = routePath.split("/");
        const chunkName = pathSnippets.join("-");

        const callLoadableExpression = type.callExpression(type.identifier("Loadable"), [
          type.objectExpression([
            type.objectProperty(
              type.identifier("loader"),
              type.arrowFunctionExpression(
                [],
                type.callExpression(type.identifier("import"), [
                  type.addComment(
                    type.stringLiteral(`${componentPath}`),
                    "leading",
                    `webpackChunkName: "page${chunkName}"`,
                  ),
                ]),
              ),
            ),
            type.objectProperty(type.identifier("loading"), type.identifier("DefaultFallback")),
            type.objectProperty(
              type.identifier("modules"),
              type.arrayExpression([type.stringLiteral(`${componentPath}`)]),
            ),
            type.objectProperty(
              type.identifier("webpack"),
              type.arrowFunctionExpression(
                [],
                type.arrayExpression([
                  type.callExpression(type.identifier("require.resolveWeak"), [
                    type.stringLiteral(`${componentPath}`),
                  ]),
                ]),
              ),
            ),
          ]),
        ]);

        // @ts-ignore
        path.node.value = type.conditionalExpression(
          type.identifier("__IS_BROWSER__"),
          callLoadableExpression,
          type.memberExpression(
            type.callExpression(type.identifier("require"), [type.stringLiteral(componentPath)]),
            type.identifier("default"),
          ),
        );
      }

      if (key.name === "fallback" && type.isStringLiteral(path.node.value)) {
        declareFallbackOption = true;
        userFallbackPath = path.node.value.value;
      }
      if (key.name === "routes" && type.isArrayExpression(path.node.value)) {
        dynamicRouteNode = path.node.value;
      }
    },
  });

  const dynamicRouteDeclaration = type.variableDeclaration("const", [
    type.variableDeclarator(type.identifier("dynamicRoute"), dynamicRouteNode),
  ]);

  const exportDefaultDeclaration = type.exportDefaultDeclaration(type.identifier("dynamicRoute"));

  const importLoadableDeclaration = type.importDeclaration(
    [type.importDefaultSpecifier(type.identifier("Loadable"))],
    type.stringLiteral("react-loadable"),
  );

  const importFallbackDeclaration = declareFallbackOption
    ? type.importDeclaration(
        [type.importDefaultSpecifier(type.identifier("DefaultFallback"))],
        type.stringLiteral(userFallbackPath),
      )
    : type.importDeclaration(
        [
          type.importSpecifier(
            type.identifier("DefaultFallback"),
            type.identifier("DefaultFallback"),
          ),
        ],
        type.stringLiteral("./defaultFallback"),
      );

  const _ast: type.Program = {
    type: "Program",
    body: [
      importLoadableDeclaration,
      importFallbackDeclaration,
      dynamicRouteDeclaration,
      exportDefaultDeclaration,
    ],
    directives: [],
    sourceFile: "",
    sourceType: "module",
    leadingComments: null,
    innerComments: null,
    trailingComments: null,
    loc: null,
    start: null,
    end: null,
    interpreter: null,
  };

  return _ast;
}

function isUseStore(ast: type.File): boolean {
  let useStore = false;

  // @ts-ignore
  traverse(ast, {
    ObjectProperty: (path) => {
      const key = path.node.key as type.Identifier;

      if (key.name === "models" && type.isIdentifier(path.node.value)) {
        useStore = true;
      }
    },
  });

  return useStore;
}

function getWrapperPath(ast: type.File): string {
  let wrapperPath = "";

  // @ts-ignore
  traverse(ast, {
    ObjectProperty: (path) => {
      const key = path.node.key as type.Identifier;

      if (key.name === "wrapper" && type.isStringLiteral(path.node.value)) {
        wrapperPath = path.node.value.value;
      }
    },
  });

  return wrapperPath;
}

export async function generateRoutes(entryFile: string, routesFile: string) {
  const entryAst = await getAst(entryFile);

  const routesAstForDynamic = await getAst(routesFile);
  const routesAstForStatic = await getAst(routesFile);
  const routesAst = await getAst(routesFile);

  let originRouteCode = "";
  let dynamicRouteCode = "";
  let staticRouteCode = "";
  let useStore = false;
  let wrapperPath = "";

  if (entryAst) {
    // @ts-ignore
    useStore = isUseStore(entryAst);
    // @ts-ignore
    wrapperPath = getWrapperPath(entryAst);
  }

  if (routesAst) {
    // @ts-ignore
    originRouteCode = generator(produceOriginRoute(routesAst)).code;
  }

  if (routesAstForDynamic) {
    // @ts-ignore
    const dynamicRouteAst = produceDynamicRoute(routesAstForDynamic);

    // @ts-ignore
    dynamicRouteCode = generator(dynamicRouteAst).code;
  }

  if (routesAstForStatic) {
    // @ts-ignore
    const staticRouteAst = produceStaticRoute(routesAstForStatic);

    // @ts-ignore
    staticRouteCode = generator(staticRouteAst).code;
  }

  return { originRouteCode, dynamicRouteCode, staticRouteCode, useStore, wrapperPath };
}
