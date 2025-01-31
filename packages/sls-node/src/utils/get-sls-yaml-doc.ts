import { type Tree } from '@nx/devkit';

import { getSlsProjectByName } from './get-sls-projects';
import { yamlParse } from './yaml-parse';

export const getSlsYamlDoc = (tree: Tree, projectName: string) => {
  const projectConfig = getSlsProjectByName(tree, projectName);
  const serverlessPath = `${projectConfig?.root}/serverless.yml`;
  const content = tree.read(serverlessPath, 'utf-8') || '';
  const doc = yamlParse(content);

  return doc;
};
