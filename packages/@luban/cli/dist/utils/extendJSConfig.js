"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recast_1 = require("recast");
const stringifyJS_1 = require("./stringifyJS");
exports.extendJSConfig = function (value, source) {
    let exportsIdentifier = null;
    const ast = recast_1.parse(source);
    function augmentExports(node) {
        const valueAST = recast_1.parse(`(${stringifyJS_1.stringifyJS(value)})`);
        const props = valueAST.program.body[0].expression.properties;
        const existingProps = node.properties;
        for (const prop of props) {
            const isUndefinedProp = prop.value.type === "Identifier" && prop.value.name === "undefined";
            const existing = existingProps.findIndex((p) => {
                return !p.computed && p.key.name === prop.key.name;
            });
            if (existing > -1) {
                existingProps[existing].value = prop.value;
                if (isUndefinedProp) {
                    existingProps.splice(existing, 1);
                }
            }
            else if (!isUndefinedProp) {
                existingProps.push(prop);
            }
        }
    }
    recast_1.types.visit(ast, {
        visitAssignmentExpression(path) {
            const { node } = path;
            if (node.left.type === "MemberExpression" &&
                node.left.object.name === "module" &&
                node.left.property.name === "exports") {
                if (node.right.type === "ObjectExpression") {
                    augmentExports(node.right);
                }
                else if (node.right.type === "Identifier") {
                    exportsIdentifier = node.right.name;
                }
                return false;
            }
            this.traverse(path);
        },
    });
    if (exportsIdentifier) {
        recast_1.types.visit(ast, {
            visitVariableDeclarator({ node }) {
                if (node.id.name === exportsIdentifier &&
                    node.init.type === "ObjectExpression") {
                    augmentExports(node.init);
                }
                return false;
            },
        });
    }
    return recast_1.print(ast).code;
};
//# sourceMappingURL=extendJSConfig.js.map