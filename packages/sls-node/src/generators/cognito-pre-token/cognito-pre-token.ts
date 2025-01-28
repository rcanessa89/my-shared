import { formatFiles, type Tree } from '@nx/devkit';

import { type CognitoPreTokenGeneratorSchema } from './schema';
import { getSlsProjects } from '../../utils/get-sls-projects';
import { updateYaml } from '../../utils/update-yml';
import { fnGenerator } from '../fn/fn';

export async function cognitoPreTokenGenerator(
  tree: Tree,
  options: CognitoPreTokenGeneratorSchema
) {
  const { projectConfig } = validate(tree, options);
  const fnName = options.name || 'pre-token-generation';

  await fnGenerator(tree, {
    project: projectConfig.name,
    name: fnName
  });
  await updateYaml(tree, options.project, (doc) => ({
    ...doc,
    functions: {
      ...doc.functions,
      [fnName]: {
        ...doc.functions[fnName],
        events: [
          ...(doc.functions[fnName].events || []),
          {
            cognitoUserPool: {
              pool: '${self:service}-${self:provider.stage}',
              trigger: 'PreTokenGeneration',
              existing: true
            }
          }
        ]
      }
    }
  }));
  await formatFiles(tree);
}

function validate(tree: Tree, options: CognitoPreTokenGeneratorSchema) {
  const projects = getSlsProjects(tree);
  const projectConfig = projects.find(({ name }) => name === options.project);

  if (!projectConfig) {
    throw new Error(
      `Project ${
        options.project
      } is not a serverless project. Available projects: ${projects.join(', ')}`
    );
  }

  return {
    projectConfig
  };
}

export default cognitoPreTokenGenerator;
