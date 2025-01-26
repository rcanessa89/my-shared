import { Tree, readJson, detectPackageManager } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import setupWsGenerator from './setup-ws';

const pm = 'pnpm';

jest.mock('@nx/devkit', () => ({
  ...jest.requireActual('@nx/devkit'),
  detectPackageManager: jest.fn(() => pm)
}));

describe('setup-ws generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add dev dependencies to package.json', async () => {
    const result = await setupWsGenerator(tree);

    const packageJson = readJson(tree, 'package.json');

    expect(packageJson.devDependencies).toEqual({
      'lint-staged': '^15.4.1',
      '@commitlint/cli': '^19.6.1',
      '@commitlint/config-conventional': '^19.6.0',
      husky: '^9.1.7'
    });
    expect(packageJson.scripts).toEqual({
      commit: 'git-cz',
      prepare: 'husky',
      format: 'npx nx format:write',
      check: 'npx nx run-many --target=lint,test,build --all --skip-nx-cache'
    });
    expect(detectPackageManager).toHaveBeenCalled();
    expect(typeof result).toBe('function');
  });

  it('should generate files from template', async () => {
    await setupWsGenerator(tree);

    expect(tree.exists('.husky/commit-msg')).toBeTruthy();
    expect(tree.exists('.husky/pre-commit')).toBeTruthy();
    expect(tree.exists('.czrc')).toBeTruthy();
    expect(tree.exists('.nvmrc')).toBeTruthy();
    expect(tree.exists('commitlint.config.js')).toBeTruthy();
    expect(tree.exists('lint-staged.config.js')).toBeTruthy();
    expect(tree.exists('wait-for-it')).toBeTruthy();
  });
});
