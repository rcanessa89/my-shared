import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';

import { fnGenerator } from './fn';
import { FnGeneratorSchema } from './schema';
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

describe('fn generator', () => {
  let tree: Tree;
  const options: FnGeneratorSchema = {
    name: 'upload-file',
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
      fnGenerator(tree, {
        project: 'invalid',
        name: 'testFn'
      })
    ).rejects.toThrow();
  });

  it('Should update serverless.yml with new function', async () => {
    await fnGenerator(tree, options);

    const content = tree.read(
      `apps/${mockProjectName}/serverless.yml`,
      'utf-8'
    );

    expect(content).toContain(`${options.name}:`);
    expect(content).toContain(`handler: dist/lambdas/${options.name}.handler`);
  });

  it('Should update package.json build config', async () => {
    await fnGenerator(tree, options);

    const pkgJson = JSON.parse(
      tree.read(`apps/${options.project}/package.json`, 'utf-8') || '{}'
    );

    expect(pkgJson.nx.targets.build.options.additionalEntryPoints).toContain(
      `apps/${options.project}/src/lambdas/${options.name}.ts`
    );
  });

  it('Should generate function file', async () => {
    await fnGenerator(tree, options);

    expect(
      tree.exists(`apps/${options.project}/src/lambdas/${options.name}.ts`)
    ).toBeTruthy();
  });
});
