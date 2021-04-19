import { transformFileSync } from "@babel/core";
import generator from "@babel/generator";
import traverse from "@babel/traverse";
import type = require("@babel/types");

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

function produceStaticRoute(ast: type.File): type.Node {
  let staticRouteNode = null;

  const importComponentDeclaration: type.ImportDeclaration[] = [];

  traverse(ast, {
    ObjectProperty(path) {
      const key = path.node.key as type.Identifier;

      if (key.name === "component" && type.isStringLiteral(path.node.value)) {
        const _path = path.node.value.value;
        const pathItem = path.node.value.value.split("/");
        const name = pathItem[pathItem.length - 1].toUpperCase();

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

  traverse(ast, {
    ObjectProperty(path) {
      const key = path.node.key as type.Identifier;
      if (key.name === "component" && type.isStringLiteral(path.node.value)) {
        const _path = path.node.value.value;
        const pathItem = path.node.value.value.split("/");
        const name = pathItem[pathItem.length - 1];

        const callLoadableExpression = type.callExpression(type.identifier("Loadable"), [
          type.objectExpression([
            type.objectProperty(
              type.identifier("loader"),
              type.arrowFunctionExpression(
                [],
                type.callExpression(type.identifier("import"), [
                  type.addComment(
                    type.stringLiteral(`${_path}`),
                    "leading",
                    `webpackChunkName: "page-${name}"`,
                  ),
                ]),
              ),
            ),
            type.objectProperty(type.identifier("loading"), type.identifier("DefaultFallback")),
            type.objectProperty(
              type.identifier("modules"),
              type.arrayExpression([type.stringLiteral(`${_path}`)]),
            ),
            type.objectProperty(
              type.identifier("webpack"),
              type.arrowFunctionExpression(
                [],
                type.arrayExpression([
                  type.callExpression(type.identifier("require.resolveWeak"), [
                    type.stringLiteral(`${_path}`),
                  ]),
                ]),
              ),
            ),
          ]),
        ]);

        path.node.value = type.conditionalExpression(
          type.identifier("__IS_BROWSER__"),
          callLoadableExpression,
          type.memberExpression(
            type.callExpression(type.identifier("require"), [type.stringLiteral(_path)]),
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

  traverse(ast, {
    ObjectProperty: (path) => {
      const key = path.node.key as type.Identifier;

      if (key.name === "models" && type.isObjectExpression(path.node.value)) {
        useStore = true;
      }
    },
  });

  return useStore;
}

export async function generateRoutes(entryFile: string, routesFile: string) {
  const entryAst = await getAst(entryFile);

  const routesAst = await getAst(routesFile);
  const originRoutesAst = await getAst(routesFile);

  let dynamicRouteCode = "";
  let staticRouteCode = "";
  let useStore = false;

  if (entryAst) {
    useStore = isUseStore(entryAst);
  }

  if (routesAst) {
    const dynamicRouteAst = produceDynamicRoute(routesAst);

    dynamicRouteCode = generator(dynamicRouteAst).code;
  }

  if (originRoutesAst) {
    const staticRouteAst = produceStaticRoute(originRoutesAst);

    staticRouteCode = generator(staticRouteAst).code;
  }

  return { dynamicRouteCode, staticRouteCode, useStore };
}