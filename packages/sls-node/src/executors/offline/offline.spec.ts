import { ExecutorContext } from '@nx/devkit';

import { OfflineExecutorSchema } from './schema';
import executor from './offline';

const options: OfflineExecutorSchema = {};
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

describe('Offline Executor', () => {
  it('can run', async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
