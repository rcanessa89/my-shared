import { ExecutorContext } from '@nx/devkit';

import { RemoveExecutorSchema } from './schema';
import executor from './remove';

const options: RemoveExecutorSchema = {};
const context: ExecutorContext = {
  root: '',
  cwd: process.cwd(),
  isVerbose: false,
  projectGraph: {
    nodes: {},
    dependencies: {}
  },
  projectsConfigurations: {
    projects: {},
    version: 2
  },
  nxJsonConfiguration: {}
};

describe('Remove Executor', () => {
  it('can run', async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
