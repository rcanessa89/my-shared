import { execSync } from 'child_process';
import { select } from './select';

export const getSlsArgs = async () => {
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

  return {
    stage,
    profile
  };
};
