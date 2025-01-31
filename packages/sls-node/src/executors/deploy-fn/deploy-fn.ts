import { PromiseExecutor } from '@nx/devkit';
import { readFileSync } from 'fs';

import { DeployFnExecutorSchema } from './schema';
import { getSlsArgs } from '../../utils/get-sls-args';
import { slsSession, slsFnDeploy } from '../../utils/sls-commands';
import { buildCommand } from '../../utils/build-command';
import { yamlParse } from '../../utils/yaml-parse';
import { select } from '../../utils/select';

const runExecutor: PromiseExecutor<DeployFnExecutorSchema> = async (
  _,
  context
) => {
  const { stage, profile, projectConfig } = await getSlsArgs(context);
  const yamlFile = readFileSync(
    `${projectConfig.data.root}/serverless.yml`,
    'utf8'
  );
  const doc = yamlParse(yamlFile);
  const fnNames = Object.keys(doc.functions);
  const fn = await select(fnNames);

  await slsSession({ profile });
  await buildCommand(projectConfig.name);
  await slsFnDeploy({
    config: `${projectConfig.data.root}/serverless.yml`,
    profile,
    stage,
    fn
  });

  return { success: true };
};

export default runExecutor;
