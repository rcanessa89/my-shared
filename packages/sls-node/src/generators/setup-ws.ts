import {
  formatFiles,
  generateFiles,
  Tree,
  addDependenciesToPackageJson,
  workspaceRoot,
  OverwriteStrategy
} from '@nx/devkit';
import * as path from 'path';

export async function setupWsGenerator(
  tree: Tree
) {
  await addDependenciesToPackageJson(
    tree,
    {},
    {
      'lint-staged': '^15.4.1',
      '@commitlint/cli': '^19.6.1',
      '@commitlint/config-conventional': '^19.6.0',
      'husky': '^9.1.7'
    }
  );

  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    workspaceRoot,
    {
      overwriteStrategy: OverwriteStrategy 
    }
  );

  await formatFiles(tree);
}

export default setupWsGenerator;
