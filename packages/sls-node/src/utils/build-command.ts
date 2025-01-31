import { executeCommand } from './exec-command';

export const buildCommand = (projectName: string) =>
  executeCommand('npx', ['nx', 'run', `${projectName}:build`, '--production']);
