import {
  formatFiles,
  generateFiles,
  readJson,
  Tree,
  updateJson
} from '@nx/devkit';
import * as path from 'path';

import { type FnGeneratorSchema } from './schema';
import { getSlsProjects } from '../../utils/get-sls-projects';
import { updateYaml } from '../../utils/update-yml';
import { getSlsYamlDoc } from '../../utils/get-sls-yaml-doc';
import { getProjectJsonPath } from '../../utils/get-project-json-path';

export async function fnGenerator(tree: Tree, options: FnGeneratorSchema) {
  const { projectRoot, entry } = validate(tree, options);

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

  const { hasPackageJson, jsonPath } = getProjectJsonPath(tree, projectRoot);

  updateJson(tree, jsonPath, (json) => {
    const targets = { ...(hasPackageJson ? json.nx.targets : json.targets) };

    Object.assign(json.nx.targets.build.options, {
      ...targets.build.options,
      additionalEntryPoints: [
        ...(targets.build.options.additionalEntryPoints || []),
        entry
      ]
    });

    return json;
  });
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    fileName: options.name
  });
  await formatFiles(tree);
}

function validate(tree: Tree, options: FnGeneratorSchema) {
  const projects = getSlsProjects(tree);
  const projectConfig = projects.find(({ name }) => name === options.project);

  if (!projectConfig) {
    throw new Error(
      `Project ${
        options.project
      } is not a serverless project. Available projects: ${projects.join(', ')}`
    );
  }

  const slsDoc = getSlsYamlDoc(tree, projectConfig.name);

  if (slsDoc.functions[options.name]) {
    throw new Error(
      `The function ${options.name} already exist on the serverless.yml`
    );
  }

  const projectRoot = projectConfig.root;
  const { hasPackageJson, jsonPath } = getProjectJsonPath(tree, projectRoot);
  const jsonConfig = readJson(tree, jsonPath);
  const targets = {
    ...(hasPackageJson ? jsonConfig.nx.targets : jsonConfig.targets)
  };
  const entryPoints = targets.build.options.additionalEntryPoints || [];
  const entry = `${projectRoot}/src/lambdas/${options.name}.ts`;

  if (entryPoints.includes(entry)) {
    throw new Error(`The entry point ${entry} already exist on nx config`);
  }

  return {
    projectRoot,
    entry
  };
}

export default fnGenerator;
