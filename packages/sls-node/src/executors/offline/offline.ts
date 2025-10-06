import { PromiseExecutor } from '@nx/devkit';

import { OfflineExecutorSchema } from './schema';
import { slsOffline } from '../../utils/sls-commands';
import { buildCommand } from '../../utils/build-command';

const runExecutor: PromiseExecutor<OfflineExecutorSchema> = async (
  _,
  context
) => {
  if (!context.projectName) {
    throw new Error(
      `No project name on executor context: ${context.projectName}`
    );
  }

  const projectConfig = context.projectGraph.nodes[context.projectName];

  await buildCommand(projectConfig.name);
  await slsOffline(`${projectConfig.data.root}/serverless.yml`);

  return { success: true };
};

export default runExecutor;
