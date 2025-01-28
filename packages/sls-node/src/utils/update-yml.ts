import { Tree } from '@nx/devkit';
import yaml from 'yaml';

import { getSlsProjectByName } from './get-sls-projects';
import { getSlsYamlDoc } from './get-sls-yaml-doc';

export const updateYaml = async (
  tree: Tree,
  projectName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatter: (doc: any) => object
) => {
  const projectConfig = getSlsProjectByName(tree, projectName);
  const serverlessPath = `${projectConfig?.root}/serverless.yml`;
  const doc = getSlsYamlDoc(tree, projectName);
  const formattedFile = formatter(doc);
  const yamlStr = yaml.stringify(formattedFile);

  tree.write(serverlessPath, yamlStr);
};
