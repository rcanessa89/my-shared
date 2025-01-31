import { ExecutorContext, PromiseExecutor } from '@nx/devkit';

import { DeployExecutorSchema } from './schema';
import { getSlsArgs } from '../../utils/get-sls-args';
import { slsSession, slsDeploy } from '../../utils/sls-commands';
import { buildCommand } from '../../utils/build-command';

const runExecutor: PromiseExecutor<DeployExecutorSchema> = async (
  _,
  context: ExecutorContext
) => {
  const { stage, profile, projectConfig } = await getSlsArgs(context);

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
