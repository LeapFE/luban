"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function deleteRemovedFiles(directory, newFiles, previousFiles) {
    const filesToDelete = Object.keys(previousFiles).filter((filename) => !newFiles[filename]);
    return Promise.all(filesToDelete.map((filename) => {
        return fs_extra_1.default.unlink(path_1.default.join(directory, filename));
    }));
}
exports.writeFileTree = async function (dir, files, previousFiles) {
    if (previousFiles) {
        await deleteRemovedFiles(dir, files, previousFiles);
    }
    Object.keys(files).forEach((name) => {
        const filePath = path_1.default.join(dir, name);
        fs_extra_1.default.ensureDirSync(path_1.default.dirname(filePath));
        fs_extra_1.default.writeFileSync(filePath, files[name]);
    });
};
