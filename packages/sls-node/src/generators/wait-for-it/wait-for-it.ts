import {
  formatFiles,
  generateFiles,
  OverwriteStrategy,
  type Tree
} from '@nx/devkit';
import * as path from 'path';

export async function waitForItGenerator(tree: Tree) {
  generateFiles(tree, path.join(__dirname, 'files'), '/', {
    overwriteStrategy: OverwriteStrategy.ThrowIfExisting
  });
  await formatFiles(tree);
}

export default waitForItGenerator;
