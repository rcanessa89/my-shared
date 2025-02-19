import { PromiseExecutor } from '@nx/devkit';

import { RemoveExecutorSchema } from './schema';
import { getSlsArgs } from '../../utils/get-sls-args';
import { slsSession, slsRemove } from '../../utils/sls-commands';
import { buildCommand } from '../../utils/build-command';

const runExecutor: PromiseExecutor<RemoveExecutorSchema> = async (
  _,
  context
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
  await slsRemove({
    config: `${projectConfig.data.root}/serverless.yml`,
    profile,
    stage
  });

  return { success: true };
};

export default runExecutor;
