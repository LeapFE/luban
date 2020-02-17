import { parse, print, types } from "recast";
import { stringifyJS } from "./stringifyJS";
import { namedTypes } from "ast-types";
import { NodePath } from "ast-types/lib/node-path";

export const extendJSConfig = function(value: any, source: string): string {
  let exportsIdentifier: any = null;
  const ast = parse(source);

  function augmentExports(node: any): void {
    const valueAST = parse(`(${stringifyJS(value)})`);
    const props = valueAST.program.body[0].expression.properties;
    const existingProps = node.properties;
    for (const prop of props) {
      const isUndefinedProp = prop.value.type === "Identifier" && prop.value.name === "undefined";

      const existing = existingProps.findIndex((p: any) => {
        return !p.computed && p.key.name === prop.key.name;
      });
      if (existing > -1) {
        // replace
        existingProps[existing].value = prop.value;

        // remove `undefined` props
        if (isUndefinedProp) {
          existingProps.splice(existing, 1);
        }
      } else if (!isUndefinedProp) {
        // append
        existingProps.push(prop);
      }
    }
  }

  types.visit(ast, {
    visitAssignmentExpression(path: NodePath<namedTypes.AssignmentExpression>) {
      const { node } = path;
      if (
        node.left.type === "MemberExpression" &&
        (node.left.object as any).name === "module" &&
        (node.left.property as any).name === "exports"
      ) {
        if (node.right.type === "ObjectExpression") {
          augmentExports(node.right);
        } else if (node.right.type === "Identifier") {
          // do a second pass
          exportsIdentifier = node.right.name;
        }
        return false;
      }
      this.traverse(path);
    },
  });

  if (exportsIdentifier) {
    types.visit(ast, {
      visitVariableDeclarator({ node }: NodePath<namedTypes.VariableDeclarator>) {
        if ((node.id as any).name === exportsIdentifier && (node as any).init.type === "ObjectExpression") {
          augmentExports(node.init);
        }
        return false;
      },
    });
  }

  return print(ast).code;
};
