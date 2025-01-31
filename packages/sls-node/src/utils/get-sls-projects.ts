import {
  getProjects,
  type ProjectConfiguration,
  type Tree,
  type ExecutorContext,
  type ProjectGraphProjectNode
} from '@nx/devkit';
import { existsSync } from 'fs';

import { PROYECT_TAG } from '../constants';

interface SlsProject extends ProjectConfiguration {
  name: string;
}

export const getSlsProjectsExec = (context: ExecutorContext) =>
  Object.values(context.projectGraph.nodes).reduce((acc, cur) => {
    if (
      cur.data.tags?.includes(PROYECT_TAG) &&
      existsSync(`${cur.data.root}/serverless.yml`)
    ) {
      acc[cur.name] = cur;
    }

    return acc;
  }, {} as Record<string, ProjectGraphProjectNode>);

export const getSlsProjects = (tree: Tree): SlsProject[] =>
  Array.from(getProjects(tree))
    .filter(
      ([, config]) =>
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
