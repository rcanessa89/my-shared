import { ExecutorContext, PromiseExecutor } from '@nx/devkit';

import { DeployExecutorSchema } from './schema';
import { getSlsArgs } from '../../utils/get-sls-args';
import { slsSession, slsDeploy } from '../../utils/sls-commands';
import { buildCommand } from '../../utils/build-command';

const runExecutor: PromiseExecutor<DeployExecutorSchema> = async (
  _,
  context: ExecutorContext
) => {
  if (!context.projectName) {
    throw new Error(
      `No project name on executor context: ${context.projectName}`
    );
  }

  const projectConfig = context.projectGraph.nodes[context.projectName];
  const { stage, profile } = await getSlsArgs();

  await slsSession({ profile });
  await buildCommand(projectConfig.name);
  await slsDeploy({
    config: `${projectConfig.data.root}/serverless.yml`,
    profile,
    stage
  });

  return { success: true };
};

export default runExecutor;
