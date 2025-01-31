import { execSync } from 'child_process';
import { getSlsProjectsExec } from './get-sls-projects';
import { select } from './select';
import { ExecutorContext } from '@nx/devkit';

export const getSlsArgs = async (context: ExecutorContext) => {
  const projects = getSlsProjectsExec(context);
  const projectNames = Object.keys(projects);

  if (!projectNames.length) {
    throw new Error('No serverless projects');
  }

  const project = await select(projectNames, 'Select a serverless project:');
  const stage = await select(['dev', 'stage', 'prod'], 'Select the stage:');
  const profiles = execSync('aws configure list-profiles', {
    encoding: 'utf-8'
  })
    .trim()
    .split('\n');

  if (!profiles.length) {
    throw new Error('No AWS profiles');
  }

  const profile = await select(profiles, 'Select your AWS profile:');
  const projectConfig = projects[project];

  return {
    stage,
    profile,
    projectConfig
  };
};
