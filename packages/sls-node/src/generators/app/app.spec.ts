import { Tree, readJson, detectPackageManager } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { applicationGenerator } from '@nx/node';

import appGenerator from './app';

const pm = 'pnpm';

jest.mock('@nx/devkit', () => ({
  ...jest.requireActual('@nx/devkit'),
  detectPackageManager: jest.fn(() => pm)
}));
jest.mock('@nx/node', () => ({
  applicationGenerator: jest.fn()
}));

describe('app generator', () => {
  let tree: Tree;
  const genParams = {
    directory: 'apps',
    name: 'api'
  };
  const runGenerator = () => appGenerator(tree, genParams);

  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add dev dependencies to package.json', async () => {
    await runGenerator();

    const packageJson = readJson(tree, 'package.json');

    expect(packageJson.devDependencies).toEqual({
      serverless: '^4.5.0',
      'serverless-offline': '^14.4.0'
    });
  });

  it('Should detect the package manager', async () => {
    await runGenerator();

    expect(detectPackageManager).toHaveBeenCalledTimes(1);
  });

  it('Should return a function', async () => {
    const result = await runGenerator();

    expect(typeof result).toBe('function');
  });

  it('Should call the node app generator', async () => {
    await runGenerator();

    expect(applicationGenerator).toHaveBeenCalledTimes(1);
    expect(applicationGenerator).toHaveBeenCalledWith(tree, genParams);
  });
});
