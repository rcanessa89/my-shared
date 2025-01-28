import { formatFiles, generateFiles, type Tree } from '@nx/devkit';
import * as path from 'path';

import { type DynamodbGeneratorSchema } from './schema';
import { getSlsProjects } from '../../utils/get-sls-projects';
import { updateYaml } from '../../utils/update-yml';

export async function dynamodbGenerator(
  tree: Tree,
  options: DynamodbGeneratorSchema
) {
  const { projectConfig, name } = validate(tree, options);
  const projectRoot = projectConfig.root;
  const resourceName = name.replace(/[-_](\w)|^(\w)/g, (_, p1, p2) =>
    (p1 || p2).toUpperCase()
  );

  await updateYaml(tree, options.project, (doc) => ({
    ...doc,
    provider: {
      ...doc.provider,
      iam: {
        ...(doc.provider?.iam || {}),
        role: {
          ...(doc.provider?.iam?.role || {}),
          statements: [
            ...(doc.provider?.iam?.role?.statements || []),
            {
              Effect: 'Allow',
              Action: ['dynamodb:*'],
              Resource: [
                {
                  'Fn::GetAtt': [resourceName, 'Arn']
                }
              ]
            }
          ]
        }
      }
    },
    resources: [...(doc.resources || []), '${file(resources/' + name + '.yml)}']
  }));
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    name,
    resourceName
  });
  await formatFiles(tree);
}

function validate(tree: Tree, options: DynamodbGeneratorSchema) {
  const projects = getSlsProjects(tree);
  const projectConfig = projects.find(({ name }) => name === options.project);

  if (!projectConfig) {
    throw new Error(
      `Project ${
        options.project
      } is not a serverless project. Available projects: ${projects.join(', ')}`
    );
  }

  const { name = 'dynamodb' } = options;

  if (tree.exists(`${projectConfig.root}/resources/${name}.yml`)) {
    throw new Error(`The resource ${name} already exist`);
  }

  return {
    projectConfig,
    name
  };
}

export default dynamodbGenerator;
