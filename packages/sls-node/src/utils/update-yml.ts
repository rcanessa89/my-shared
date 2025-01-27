import { Tree } from '@nx/devkit';
import * as yaml from 'yaml';

import { getSlsProjectByName } from './get-sls-projects';

export const updateYaml = async (
  tree: Tree,
  projectName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatter: (doc: any) => object
) => {
  const projectConfig = getSlsProjectByName(tree, projectName);
  const serverlessPath = `${projectConfig?.root}/serverless.yml`;
  const content = tree.read(serverlessPath, 'utf-8') || '';
  const doc = yaml.parse(content);
  const formattedFile = formatter(doc);

  tree.write(serverlessPath, yaml.stringify(formattedFile));
};
