import path from 'path';
import { Tree, readJson, workspaceRoot } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import setupWsGenerator from './setup-ws';

describe('setup-ws generator', () => {
 let tree: Tree;

 beforeEach(() => {
   tree = createTreeWithEmptyWorkspace();
 });

 it('should add dev dependencies to package.json', async () => {
   await setupWsGenerator(tree);
   
   const packageJson = readJson(tree, 'package.json');
   expect(packageJson.devDependencies).toEqual({
     'lint-staged': '^15.4.1',
     '@commitlint/cli': '^19.6.1',
     '@commitlint/config-conventional': '^19.6.0',
     'husky': '^9.1.7'
   });
 });

 it('should generate files from template', async () => {
   await setupWsGenerator(tree);

   expect(tree.exists(path.join(workspaceRoot, '.husky/commit-msg'))).toBeTruthy();
   expect(tree.exists(path.join(workspaceRoot, '.husky/pre-commit'))).toBeTruthy();
   expect(tree.exists(path.join(workspaceRoot, '.czrc'))).toBeTruthy();
   expect(tree.exists(path.join(workspaceRoot, '.nvmrc'))).toBeTruthy();
   expect(tree.exists(path.join(workspaceRoot, 'commitlint.config.js'))).toBeTruthy();
   expect(tree.exists(path.join(workspaceRoot, 'lint-staged.config.js'))).toBeTruthy();
   expect(tree.exists(path.join(workspaceRoot, 'wait-for-it'))).toBeTruthy();
 });
});