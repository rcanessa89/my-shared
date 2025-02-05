import * as path from 'path';
import {
  formatFiles,
  generateFiles,
  addDependenciesToPackageJson,
  updateJson,
  detectPackageManager,
  OverwriteStrategy,
  type Tree
} from '@nx/devkit';

import { installDeps } from '../../utils/install-deps';

export async function setupWsGenerator(tree: Tree) {
  await addDependenciesToPackageJson(
    tree,
    {},
    {
      'lint-staged': '^15.4.1',
      '@commitlint/cli': '^19.6.1',
      '@commitlint/config-conventional': '^19.6.0',
      'cz-conventional-changelog': '^3.3.0',
      husky: '^9.1.7'
    }
  );
  updateJson(tree, 'package.json', (json) => {
    json.scripts = {
      ...json.scripts,
      commit: 'git-cz',
      prepare: 'husky',
      format: 'npx nx format:write',
      check: 'npx nx run-many --target=lint,test,build --all --skip-nx-cache'
    };

    return json;
  });

  const projectRoot = '/';

  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    overwriteStrategy: OverwriteStrategy.ThrowIfExisting
  });

  await formatFiles(tree);

  const packageManager = detectPackageManager();

  return installDeps({
    tree,
    alwaysRun: true,
    cwd: projectRoot,
    packageManager
  });
}

export default setupWsGenerator;
