const nx = require('@nx/eslint-plugin');
const baseConfig = require('../../eslint.config.cjs');

module.exports = [
  {
    files: ["./package.json"],
    rules: {
      '@typescript-eslint/no-unused-expressions': "off"
    }
  },
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    ignores: ["./package.json"],
    rules: {}
  }
];
