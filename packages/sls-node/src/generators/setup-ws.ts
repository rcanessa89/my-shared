import {
  formatFiles,
  generateFiles,
  Tree,
  addDependenciesToPackageJson,
  OverwriteStrategy,
  installPackagesTask,
  updateJson,
  detectPackageManager
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

   const projectRoot = '/';

  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    projectRoot,
    {
      overwriteStrategy: OverwriteStrategy 
    }
  );

  await formatFiles(tree);

  const pm = detectPackageManager();

  return () => installPackagesTask(tree, true, projectRoot, pm);
}

export default setupWsGenerator;
