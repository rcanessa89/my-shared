import {
  installPackagesTask,
  type PackageManager,
  type Tree
} from "@nx/devkit";

export const installDeps =
  ({
    tree,
    alwaysRun,
    cwd,
    packageManager
  }: {
    tree: Tree;
    alwaysRun?: boolean;
    cwd?: string;
    packageManager?: PackageManager
  }) =>
  () =>
    installPackagesTask(tree, alwaysRun, cwd, packageManager);
  