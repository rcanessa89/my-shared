import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { type Tree } from '@nx/devkit';

import { waitForItGenerator } from './wait-for-it';

describe('wait-for-it generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('Should generate the file', async () => {
    await waitForItGenerator(tree);

    expect(tree.exists('wait-for-it')).toBeTruthy();
  });
});
