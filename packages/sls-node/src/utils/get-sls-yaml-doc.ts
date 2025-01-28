import { type Tree } from '@nx/devkit';
import yaml from 'yaml';

import { getSlsProjectByName } from './get-sls-projects';

export const getSlsYamlDoc = (tree: Tree, projectName: string) => {
  const projectConfig = getSlsProjectByName(tree, projectName);
  const serverlessPath = `${projectConfig?.root}/serverless.yml`;
  const content = tree.read(serverlessPath, 'utf-8') || '';
  const doc = yaml.parse(content, {
    customTags: (tags) =>
      tags.concat([
        {
          tag: '!Ref',
          test: /^.*$/,
          resolve: (str: string) => str
        }
      ])
  });

  return doc;
};
