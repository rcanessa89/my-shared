import {
  formatFiles,
  generateFiles,
  Tree,
  addDependenciesToPackageJson,
  OverwriteStrategy,
  installPackagesTask,
  updateJson
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
  await updateJson(tree, 'package.json', (json) => {
    json.scripts = {
      ...json.scripts,
      'commit': 'git-cz',
      'prepare': 'husky',
      'format': 'npx nx format:write',
      'check': 'npx nx run-many --target=lint,test,build --all --skip-nx-cache'
    };

    return json;
   });

  installPackagesTask(tree);

  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    '/',
    {
      overwriteStrategy: OverwriteStrategy 
    }
  );

  await formatFiles(tree);
}

export default setupWsGenerator;
