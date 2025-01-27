import {
  addDependenciesToPackageJson,
  detectPackageManager,
  formatFiles,
  generateFiles,
  updateJson,
  type Tree
} from '@nx/devkit';
import { applicationGenerator } from '@nx/node';
import * as path from 'path';

import { AppGeneratorSchema } from './schema';
import { installDeps } from '../../utils/install-deps';
import { PROYECT_TAG } from '../../constants';

const getTags = (tags?: string) => {
  const strValue = tags || '';

  return [...strValue.split(','), PROYECT_TAG].join(',');
};

export async function appGenerator(tree: Tree, options: AppGeneratorSchema) {
  const name = options.name || path.basename(options.directory);
  const projectRoot = options.directory;
  const packageManager = detectPackageManager();

  Object.assign(options, { name });
  Object.assign(options, { tags: getTags(options.tags) });

  await applicationGenerator(tree, options);

  updateJson(tree, `${projectRoot}/package.json`, (json) => {
    Object.assign(json.nx.targets.build, {
      options: {
        ...json.nx.targets.build.options,
        outputPath: `${projectRoot}/dist`,
        main: `${projectRoot}/src/main.ts`,
        additionalEntryPoints: [`${projectRoot}/src/lambdas/handler.ts`]
      },
      configurations: {
        ...json.nx.targets.build.configurations,
        production: {
          minify: true,
          thirdParty: false,
          esbuildOptions: {
            sourcemap: false
          }
        }
      }
    });

    return json;
  });

  await addDependenciesToPackageJson(
    tree,
    {},
    {
      serverless: '^4.5.0',
      'serverless-offline': '^14.4.0'
    }
  );

  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
  await formatFiles(tree);

  return installDeps({
    tree,
    alwaysRun: false,
    cwd: projectRoot,
    packageManager
  });
}

export default appGenerator;
