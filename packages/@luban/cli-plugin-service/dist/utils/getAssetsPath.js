"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
exports.getAssetsPath = function (options, filePath) {
    return options.assetsDir ? path_1.default.posix.join(options.assetsDir, filePath) : filePath;
};
//# sourceMappingURL=getAssetsPath.js.map