const nx = require('@nx/eslint-plugin');
const baseConfig = require('../../eslint.config.cjs');

module.exports = [
  {
    ignores: ['**/package.json', '**/package-lock.json', '**/node_modules/**']
  },
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {}
  }
];
