import { transformTypes } from "./configTransforms";

class ConfigTransform {
  private readonly fileDescriptor: Record<string, string[]>;

  constructor(options: { file: Record<string, string[]> }) {
    this.fileDescriptor = options.file;
  }

  transform(
    value: any,
    checkExisting: boolean,
    files: Record<string, string>,
    context: string,
  ): { filename: string; content: string } | null {
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

    const transform = transformTypes[type];

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

  findFile(files: Record<string, string>): { type?: string; filename?: string } {
    let targetFile: { type?: string; filename?: string } = {};

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

  getDefaultFile(): { type?: string; filename?: string } {
    const [type] = Object.keys(this.fileDescriptor);
    const [filename] = this.fileDescriptor[type];

    return { type, filename };
  }
}

export { ConfigTransform };
