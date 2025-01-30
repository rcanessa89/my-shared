import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { type Tree } from '@nx/devkit';

import { dockerDynamodbGenerator } from './docker-dynamodb';
import { type DockerDynamodbGeneratorSchema } from './schema';
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

describe('docker-dynamodb generator', () => {
  let tree: Tree;
  const options: DockerDynamodbGeneratorSchema = {
    project: mockProjectName
  };

  beforeEach(() => {
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
  });

  it('Should generate the docker compose file', async () => {
    await dockerDynamodbGenerator(tree, options);

    expect(
      tree.exists(`apps/${mockProjectName}/docker-compose.yaml`)
    ).toBeTruthy();
  });

  it('Should generate the files with init', async () => {
    await dockerDynamodbGenerator(tree, {
      ...options,
      init: true
    });

    expect(tree.exists(`wait-for-it`)).toBeTruthy();
    expect(tree.exists(`apps/${mockProjectName}/init-script.js`)).toBeTruthy();
    expect(
      tree.exists(`apps/${mockProjectName}/docker-compose.yaml`)
    ).toBeTruthy();
  });
});
