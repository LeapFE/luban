"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configTransforms_1 = require("./configTransforms");
class ConfigTransform {
    constructor(options) {
        this.fileDescriptor = options.file;
    }
    transform(value, checkExisting, files, context) {
        let file;
        if (checkExisting) {
            file = this.findFile(files);
        }
        if (!file) {
            file = this.getDefaultFile();
        }
        const { type, filename } = file;
        if (!type || !filename) {
            return null;
        }
        const transform = configTransforms_1.transformTypes[type];
        let source;
        let existing;
        if (checkExisting) {
            source = files[filename];
            if (source) {
                existing = transform.read({
                    source,
                    filename,
                    context,
                });
            }
        }
        const content = transform.write({
            source,
            filename,
            context,
            value,
            existing,
        });
        return {
            filename,
            content,
        };
    }
    findFile(files) {
        let targetFile = {};
        for (const type of Object.keys(this.fileDescriptor)) {
            const descriptors = this.fileDescriptor[type];
            for (const filename of descriptors) {
                if (files[filename]) {
                    targetFile = { type, filename };
                }
            }
        }
        return targetFile;
    }
    getDefaultFile() {
        const [type] = Object.keys(this.fileDescriptor);
        const [filename] = this.fileDescriptor[type];
        return { type, filename };
    }
}
exports.ConfigTransform = ConfigTransform;
//# sourceMappingURL=configTransform.js.map