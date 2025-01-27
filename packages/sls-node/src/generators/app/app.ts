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

export async function appGenerator(tree: Tree, options: AppGeneratorSchema) {
  const name = options.name || path.basename(options.directory);

  Object.assign(options, { name });

  await applicationGenerator(tree, options);
  await addDependenciesToPackageJson(
    tree,
    {},
    {
      serverless: '^4.5.0',
      'serverless-offline': '^14.4.0'
    }
  );

  const projectRoot = options.directory;
  const packageManager = detectPackageManager();

  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
  await formatFiles(tree);

  return () => {
    installDeps({ tree, alwaysRun: false, cwd: projectRoot, packageManager })();
    updateJson(tree, `${projectRoot}/package.json`, (json) => {
      Object.assign(json.nx.targets.build, {
        options: {
          ...json.nx.targets.build.options,
          outputPath: `${projectRoot}/dist`,
          main: `${projectRoot}/src/main.ts`,
          additionalEntryPoints: [
            `${projectRoot}/src/lambdas/handler.ts`,
          ]
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
  };
}

export default appGenerator;
