const getRelativePath = (filePath) => filePath.split('my-shared/')[1];

module.exports = {
  '{apps,libs,packages}/**/*.{ts,tsx,js,jsx}': (files) => [
    `pnpm nx affected:lint --files=${files
      .map(getRelativePath)
      .join(',')} -- --fix --parallel`
  ],
  '{apps,libs,packages}/**/*.{ts,tsx,js,jsx,json,md,html,yaml,json}': (files) => [
    'pnpm nx format:write -- --uncommitted',
    `git add ${files.map(getRelativePath).join(' ')}`
  ]
};
