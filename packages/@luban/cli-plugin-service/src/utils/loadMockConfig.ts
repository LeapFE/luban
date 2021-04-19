import { MockConfig } from "../main";
import path from "path";
import chalk from "chalk";
import fs from "fs-extra";

import { error, warn, loadFile } from "@luban-cli/cli-shared-utils";

export function loadMockConfig(
  context: string,
  filename: string,
  enableMock: boolean,
): MockConfig | undefined {
  let _mockConfig: MockConfig | undefined = undefined;

  if (!enableMock) {
    return _mockConfig;
  }

  const mockConfigFilePath = path.resolve(context, filename);

  if (!fs.pathExistsSync(mockConfigFilePath)) {
    warn(
      `specified mock config file ${chalk.bold(
        `${mockConfigFilePath}`,
      )} nonexistent, please check it.`,
    );

    return;
  }

  try {
    _mockConfig = loadFile<MockConfig>(mockConfigFilePath);

    if (!_mockConfig || typeof _mockConfig !== "object" || _mockConfig === null) {
      error(`Error load ${chalk.bold(`${filename}`)}: should export an object. \n`);
      _mockConfig = undefined;
    }
  } catch (e) {}

  return _mockConfig;
}
