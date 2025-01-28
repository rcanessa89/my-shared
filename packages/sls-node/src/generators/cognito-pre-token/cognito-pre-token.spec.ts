import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { type Tree } from '@nx/devkit';

import { cognitoPreTokenGenerator } from './cognito-pre-token';
import { CognitoPreTokenGeneratorSchema } from './schema';
import { PROYECT_TAG } from '../../constants';

const mockProjectName = 'test-api';

jest.mock('@nx/devkit', () => ({
  ...jest.requireActual('@nx/devkit'),
  getProjects: () =>
    new Map([
      [
        mockProjectName,
        {
          root: `apps/${mockProjectName}`,
          tags: [PROYECT_TAG],
          targets: {}
        }
      ]
    ])
}));

describe('cognito-pre-token generator', () => {
  let tree: Tree;
  const options: CognitoPreTokenGeneratorSchema = {
    name: 'pre-token',
    project: mockProjectName
  };

  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    tree.write(
      `apps/${mockProjectName}/serverless.yml`,
      `
      functions:
        handler:
          handler: dist/lambdas/handler.handler
          package:
            patterns:
              - './dist/lambdas/handler.cjs'
          events:
            - httpApi:
                method: GET
                path: /
      `
    );
    tree.write(
      `apps/${mockProjectName}/package.json`,
      JSON.stringify({
        nx: {
          targets: {
            build: {
              options: {
                additionalEntryPoints: []
              }
            }
          }
        }
      })
    );
  });

  it('Should throw error if the project is not serverless', async () => {
    await expect(
      cognitoPreTokenGenerator(tree, {
        project: 'invalid',
        name: 'testFn'
      })
    ).rejects.toThrow();
  });

  it('Should update serverless.yml with new function', async () => {
    await cognitoPreTokenGenerator(tree, options);

    const content = tree.read(
      `apps/${mockProjectName}/serverless.yml`,
      'utf-8'
    );

    expect(content).toContain(`
  ${options.name}:
    handler: dist/lambdas/${options.name}.handler
    package:
      patterns:
        - ./dist/lambdas/${options.name}.cjs
    events:
      - cognitoUserPool:
          pool: \${self:service}-\${self:provider.stage}
          trigger: PreTokenGeneration
          existing: true`);
  });

  it('Should update serverless.yml with new function default name', async () => {
    await cognitoPreTokenGenerator(tree, {
      project: options.project
    });

    const content = tree.read(
      `apps/${mockProjectName}/serverless.yml`,
      'utf-8'
    );

    expect(content).toContain(`
  pre-token-generation:
    handler: dist/lambdas/pre-token-generation.handler
    package:
      patterns:
        - ./dist/lambdas/pre-token-generation.cjs
    events:
      - cognitoUserPool:
          pool: \${self:service}-\${self:provider.stage}
          trigger: PreTokenGeneration
          existing: true`);
  });

  it('Should update package.json build config', async () => {
    await cognitoPreTokenGenerator(tree, options);

    const pkgJson = JSON.parse(
      tree.read(`apps/${options.project}/package.json`, 'utf-8') || '{}'
    );

    expect(pkgJson.nx.targets.build.options.additionalEntryPoints).toContain(
      `apps/${options.project}/src/lambdas/${options.name}.ts`
    );
  });

  it('Should generate function file', async () => {
    await cognitoPreTokenGenerator(tree, options);

    expect(
      tree.exists(`apps/${options.project}/src/lambdas/${options.name}.ts`)
    ).toBeTruthy();
  });
});
