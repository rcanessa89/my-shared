import { type ProjectConfiguration, getProjects, type Tree } from '@nx/devkit';

import { PROYECT_TAG } from '../constants';

interface SlsProject extends ProjectConfiguration {
  name: string;
}

export const getSlsProjects = (tree: Tree): SlsProject[] =>
  Array.from(getProjects(tree))
    .filter(
      ([_, config]) =>
        tree.exists(`${config.root}/serverless.yml`) &&
        config.tags &&
        config.tags.includes(PROYECT_TAG)
    )
    .map(([name, config]) => ({
      ...config,
      name
    }));

export const getSlsProjectByName = (tree: Tree, name: string) =>
  getSlsProjects(tree).find((p) => p.name === name);
