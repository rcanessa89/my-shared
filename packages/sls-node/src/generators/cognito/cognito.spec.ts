import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { type Tree } from '@nx/devkit';

import { cognitoGenerator } from './cognito';
import { type CognitoGeneratorSchema } from './schema';
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

describe('cognito generator', () => {
  let tree: Tree;
  const options: CognitoGeneratorSchema = {
    project: mockProjectName,
    preTokenFn: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    tree.write(
      `apps/${mockProjectName}/serverless.yml`,
      `
      provider:
        name: aws
        runtime: nodejs22.x
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
      cognitoGenerator(tree, {
        project: 'invalid'
      })
    ).rejects.toThrow();
  });

  it('Should update serverless.yml with the authorizer and resource', async () => {
    await cognitoGenerator(tree, options);

    const content = tree.read(
      `apps/${mockProjectName}/serverless.yml`,
      'utf-8'
    );

    expect(content).toContain(`
      cognitoAuthorizer:
        identitySource: $request.header.Authorization
        issuerUrl:
          Fn::Join:
            - ''
            - - https://cognito-idp.
              - \${opt:region, self:provider.region}
              - .amazonaws.com/
              - Ref: CognitoUserPool
        audience:
          - Ref: CognitoUserPoolClient`);
    expect(content).toContain('${file(resources/cognito.yml)}');
  });

  describe('With pre token function', () => {
    it('Should update serverless.yml with new function', async () => {
      await cognitoGenerator(tree, options);

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

    it('Should update serverless.yml with new function default name', async () => {
      await cognitoGenerator(tree, options);

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
      await cognitoGenerator(tree, options);

      const pkgJson = JSON.parse(
        tree.read(`apps/${options.project}/package.json`, 'utf-8') || '{}'
      );

      expect(pkgJson.nx.targets.build.options.additionalEntryPoints).toContain(
        `apps/${options.project}/src/lambdas/pre-token-generation.ts`
      );
    });

    it('Should generate function file', async () => {
      await cognitoGenerator(tree, options);

      expect(
        tree.exists(
          `apps/${options.project}/src/lambdas/pre-token-generation.ts`
        )
      ).toBeTruthy();
    });
  });
});
