declare class ConfigTransform {
  private readonly fileDescriptor;
  constructor(options: { file: Record<string, string[]> });
  transform(
    value: any,
    checkExisting: boolean,
    files: Record<string, string>,
    context: string,
  ): {
    filename: string;
    content: string;
  } | null;
  findFile(
    files: Record<string, string>,
  ): {
    type?: string;
    filename?: string;
  };
  getDefaultFile(): {
    type?: string;
    filename?: string;
  };
}
export { ConfigTransform };
