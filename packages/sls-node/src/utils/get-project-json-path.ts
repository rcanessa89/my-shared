import { type Tree } from '@nx/devkit';

export const getProjectJsonPath = (tree: Tree, projectRoot: string) => {
  const hasPackageJson = tree.exists(`${projectRoot}/package.json`);
  const jsonPath = hasPackageJson
    ? `${projectRoot}/package.json`
    : `${projectRoot}/project.json`;

  return {
    hasPackageJson,
    jsonPath
  };
};
