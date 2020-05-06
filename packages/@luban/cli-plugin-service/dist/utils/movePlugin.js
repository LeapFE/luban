"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
class MovePlugin {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
    apply(compiler) {
        compiler.hooks.done.tap("move-plugin", () => {
            if (fs_extra_1.default.existsSync(this.from)) {
                fs_extra_1.default.moveSync(this.from, this.to, { overwrite: true });
            }
        });
    }
}
exports.MovePlugin = MovePlugin;
//# sourceMappingURL=movePlugin.js.map