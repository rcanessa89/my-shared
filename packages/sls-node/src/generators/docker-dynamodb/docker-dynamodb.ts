import {
  OverwriteStrategy,
  formatFiles,
  generateFiles,
  type Tree
} from '@nx/devkit';
import * as path from 'path';

import { type DockerDynamodbGeneratorSchema } from './schema';
import { waitForItGenerator } from '../wait-for-it/wait-for-it';
import { getSlsProjects } from '../../utils/get-sls-projects';

export async function dockerDynamodbGenerator(
  tree: Tree,
  options: DockerDynamodbGeneratorSchema
) {
  const projects = getSlsProjects(tree);
  const projectConfig = projects.find(({ name }) => name === options.project);

  if (!projectConfig) {
    throw new Error(
      `Project ${
        options.project
      } is not a serverless project. Available projects: ${projects.join(', ')}`
    );
  }

  const projectRoot = projectConfig.root;

  if (options.init) {
    waitForItGenerator(tree);
    generateFiles(
      tree,
      path.join(__dirname, 'files-init'),
      projectRoot,
      options,
      {
        overwriteStrategy: OverwriteStrategy.ThrowIfExisting
      }
    );
  } else {
    generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options, {
      overwriteStrategy: OverwriteStrategy.ThrowIfExisting
    });
  }

  await formatFiles(tree);
}

export default dockerDynamodbGenerator;
