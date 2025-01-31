import { spawn } from 'child_process';

export const executeCommand = (
  command: string,
  args: string[] = []
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      stdio: 'inherit'
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
};
