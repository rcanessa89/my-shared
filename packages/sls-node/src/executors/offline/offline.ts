import { PromiseExecutor } from '@nx/devkit';

import { OfflineExecutorSchema } from './schema';
import { slsOffline } from '../../utils/sls-commands';
import { buildCommand } from '../../utils/build-command';
import { select } from '../../utils/select';
import { getSlsProjectsExec } from '../../utils/get-sls-projects';

const runExecutor: PromiseExecutor<OfflineExecutorSchema> = async (
  _,
  context
) => {
  const projects = getSlsProjectsExec(context);
  const projectNames = Object.keys(projects);

  if (!projectNames.length) {
    throw new Error('No serverless projects');
  }

  const project = await select(projectNames, 'Select a serverless project:');
  const projectConfig = projects[project];

  await buildCommand(projectConfig.name);
  await slsOffline();

  return { success: true };
};

export default runExecutor;
