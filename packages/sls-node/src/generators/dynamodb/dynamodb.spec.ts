import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { type Tree } from '@nx/devkit';

import { dynamodbGenerator } from './dynamodb';
import { type DynamodbGeneratorSchema } from './schema';
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

describe('dynamodb generator', () => {
  let tree: Tree;
  const options: DynamodbGeneratorSchema = {
    project: mockProjectName
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
      `
    );
  });

  it('Should throw error if the project is not serverless', async () => {
    await expect(
      dynamodbGenerator(tree, {
        project: 'invalid'
      })
    ).rejects.toThrow();
  });

  it('Should update serverless.yml with the resource', async () => {
    await dynamodbGenerator(tree, options);

    const content = tree.read(
      `apps/${mockProjectName}/serverless.yml`,
      'utf-8'
    );

    expect(content).toContain('${file(resources/dynamodb.yml)}');
  });

  it('Should create the resource file', async () => {
    const name = 'test-db';

    await dynamodbGenerator(tree, {
      ...options,
      name
    });

    expect(
      tree.exists(`apps/${mockProjectName}/resources/${name}.yml`)
    ).toBeTruthy();
  });
});
