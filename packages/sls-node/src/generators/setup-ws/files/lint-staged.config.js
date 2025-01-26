const path = require('path');
const dirName = path.basename(__dirname);
const getRelativePath = (filePath) => {
  const normalizedPath = path.normalize(filePath);
  const parts = normalizedPath.split(path.sep);
  const dirIndex = parts.indexOf(dirName);

  return parts.slice(dirIndex + 1).join(path.sep);
};

module.exports = {
  '{apps,libs,packages}/**/*.{ts,tsx,js,jsx}': (files) => [
    `pnpm nx affected:lint --files=${files
      .map(getRelativePath)
      .join(',')} -- --fix`
  ],
  '{apps,libs,packages}/**/*.{ts,tsx,js,jsx,json,md,html,yaml,json}': (
    files
  ) => [
    'pnpm nx format:write -- --uncommitted',
    `git add ${files.map(getRelativePath).join(' ')}`
  ]
};
