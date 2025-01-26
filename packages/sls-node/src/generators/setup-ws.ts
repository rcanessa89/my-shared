import {
  formatFiles,
  generateFiles,
  Tree,
  addDependenciesToPackageJson
} from '@nx/devkit';
import * as path from 'path';
import { SetupWsGeneratorSchema } from './schema';

export async function setupWsGenerator(
  tree: Tree,
  options: SetupWsGeneratorSchema
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

  const projectRoot = `./`;

  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);

  await formatFiles(tree);
}

export default setupWsGenerator;
