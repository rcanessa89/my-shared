import { formatFiles, generateFiles, type Tree } from '@nx/devkit';
import * as path from 'path';

import { CognitoGeneratorSchema } from './schema';
import { cognitoPreTokenGenerator } from '../cognito-pre-token/cognito-pre-token';
import { getSlsProjects } from '../../utils/get-sls-projects';
import { updateYaml } from '../../utils/update-yml';

export async function cognitoGenerator(
  tree: Tree,
  options: CognitoGeneratorSchema
) {
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
  const { name = 'cognito' } = options;

  if (options.preTokenFn) {
    await cognitoPreTokenGenerator(tree, { project: projectConfig.name });
  }

  await updateYaml(tree, options.project, (doc) => ({
    ...doc,
    provider: {
      ...doc.provider,
      httpApi: {
        ...(doc.provider.httpApi || {}),
        authorizers: {
          cognitoAuthorizer: {
            identitySource: '$request.header.Authorization',
            issuerUrl: {
              'Fn::Join': [
                '',
                [
                  'https://cognito-idp.',
                  '${opt:region, self:provider.region}',
                  '.amazonaws.com/',
                  { Ref: 'CognitoUserPool' }
                ]
              ]
            },
            audience: [{ Ref: 'CognitoUserPoolClient' }]
          }
        }
      }
    },
    resources: [...(doc.resources || []), '${file(resources/' + name + '.yml)}']
  }));
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, { name });
  await formatFiles(tree);
}

export default cognitoGenerator;
