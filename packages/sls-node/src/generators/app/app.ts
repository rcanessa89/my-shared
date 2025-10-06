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

import { type AppGeneratorSchema } from './schema';
import { installDeps } from '../../utils/install-deps';
import { getProjectJsonPath } from '../../utils/get-project-json-path';
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

  const { hasPackageJson, jsonPath } = getProjectJsonPath(tree, projectRoot);

  updateJson(tree, jsonPath, (json) => {
    const targets = { ...(hasPackageJson ? json.nx.targets : json.targets) };
    const newTargets = {
      deploy: {
        executor: '@rcanessa/sls-node:deploy',
        dependsOn: ['build']
      },
      'deploy-fn': {
        executor: '@rcanessa/sls-node:deploy-fn',
        dependsOn: ['build']
      },
      offline: {
        executor: '@rcanessa/sls-node:offline',
        dependsOn: ['build']
      },
      remove: {
        executor: '@rcanessa/sls-node:remove'
      }
    };
    const jsonChanges = {
      options: {
        ...targets.build.options,
        outputPath: `${projectRoot}/dist`,
        main: `${projectRoot}/src/main.ts`,
        additionalEntryPoints: [`${projectRoot}/src/lambdas/handler.ts`]
      },
      configurations: {
        ...targets.build.configurations,
        production: {
          bundle: true,
          declaration: false,
          minify: true,
          thirdParty: false,
          sourcemap: false,
          esbuildOptions: {
            sourcemap: false
          }
        }
      }
    };

    if (hasPackageJson) {
      Object.assign(json.nx.targets.build, jsonChanges);
      Object.assign(json.nx.targets, {
        ...newTargets
      });
    } else {
      Object.assign(json.targets.build, jsonChanges);
      Object.assign(json.targets, {
        ...newTargets
      });
    }

    return json;
  });

  await addDependenciesToPackageJson(
    tree,
    {},
    {
      serverless: '^4.20.2',
      'serverless-offline': '^14.4.0'
    }
  );

  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
  await formatFiles(tree);

  return installDeps({
    tree,
    alwaysRun: true,
    cwd: projectRoot,
    packageManager
  });
}

export default appGenerator;
