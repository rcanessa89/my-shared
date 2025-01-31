import { executeCommand } from './exec-command';
import { SLS_COMMAND } from '../constants';

interface SlsCommandArgs {
  config: string;
  profile: string;
  stage: string;
  fn?: string;
}

interface SlsCommandFnDeployArgs extends SlsCommandArgs {
  fn: string;
}

const buildSlsCommandArgs = (
  command: string,
  { config, profile, stage, fn }: SlsCommandArgs
) => [
  command,
  ...(fn ? ['function', '--function', fn] : []),
  '--config',
  config,
  '--aws-profile',
  profile,
  '--stage',
  stage,
  '--verbose'
];

export const slsDeploy = (args: SlsCommandArgs) =>
  executeCommand(SLS_COMMAND, buildSlsCommandArgs('deploy', args));

export const slsFnDeploy = (args: SlsCommandFnDeployArgs) =>
  executeCommand(SLS_COMMAND, buildSlsCommandArgs('deploy', args));

export const slsRemove = (args: SlsCommandArgs) =>
  executeCommand(SLS_COMMAND, buildSlsCommandArgs('remove', args));

export const slsOffline = () =>
  executeCommand(SLS_COMMAND, ['offline', '--verbose']);

export const slsSession = async ({ profile }: { profile: string }) => {
  try {
    await executeCommand('aws', [
      'sts',
      'get-caller-identity',
      '--profile',
      profile
    ]);
  } catch (error: unknown) {
    await executeCommand('aws', ['sso', 'login', '--profile', profile]);
  }
};
