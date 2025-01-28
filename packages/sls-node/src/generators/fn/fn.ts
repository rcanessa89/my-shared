import { formatFiles, generateFiles, Tree, updateJson } from '@nx/devkit';
import * as path from 'path';

import { FnGeneratorSchema } from './schema';
import { getSlsProjects } from '../../utils/get-sls-projects';
import { updateYaml } from '../../utils/update-yml';

export async function fnGenerator(tree: Tree, options: FnGeneratorSchema) {
  const projects = getSlsProjects(tree);
  const projectConfig = projects.find(({ name }) => name === options.project);

  if (!projectConfig) {
    throw new Error(
      `Project ${
        options.project
      } is not a serverless project. Available projects: ${projects.join(', ')}`
    );
  }

  const projectRoot = projectConfig.root;

  await updateYaml(tree, options.project, (doc) => ({
    ...doc,
    functions: {
      ...doc.functions,
      [options.name]: {
        handler: `dist/lambdas/${options.name}.handler`,
        package: {
          patterns: [`./dist/lambdas/${options.name}.cjs`]
        }
      }
    }
  }));
  updateJson(tree, `${projectRoot}/package.json`, (json) => {
    Object.assign(json.nx.targets.build.options, {
      ...json.nx.targets.build.options,
      additionalEntryPoints: [
        ...(json.nx.targets.build.options.additionalEntryPoints || []),
        `${projectRoot}/src/lambdas/${options.name}.ts`
      ]
    });

    return json;
  });
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    fileName: options.name
  });
  await formatFiles(tree);
}

export default fnGenerator;
