import { Tree, readJson, detectPackageManager } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { applicationGenerator } from '@nx/node';

import appGenerator from './app';

const pm = 'pnpm';

jest.mock('@nx/devkit', () => ({
  ...jest.requireActual('@nx/devkit'),
  detectPackageManager: jest.fn(() => pm),
  installPackagesTask: jest.fn()
}));
jest.mock('@nx/node', () => ({
  applicationGenerator: jest.fn()
}));

describe('app generator', () => {
  let tree: Tree;
  const genParams = {
    directory: 'apps/api',
    name: 'api'
  };
  const runGenerator = () => appGenerator(tree, genParams);

  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    tree.write(
      `${genParams.directory}/package.json`,
      `{
      "nx": {
        "targets": {
          "build": {
            "configurations": {}
          }
        }
      }
    }`
    );
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

  it('should check the nx configuration in package.json', async () => {
    await runGenerator();

    const packageJson = readJson(tree, `${genParams.directory}/package.json`);

    expect(packageJson.nx.targets.build.configurations.production).toEqual({
      bundle: true,
      declaration: false,
      minify: true,
      thirdParty: false,
      sourcemap: false,
      esbuildOptions: {
        sourcemap: false
      }
    });
  });
});
