const baseConfig = require('../../eslint.config.cjs');

module.exports = [
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'warn',
        {
          ignoredFiles: ['{projectRoot}/eslint.config.{js,cjs,mjs}']
        }
      ]
    },
    languageOptions: {
      parser: require('jsonc-eslint-parser')
    }
  },
  {
    files: [
      '**/package.json',
      '**/generators.json',
      '**/package.json',
      '**/generators.json',
      '**/executors.json'
    ],
    rules: {
      '@nx/nx-plugin-checks': 'error'
    },
    languageOptions: {
      parser: require('jsonc-eslint-parser')
    }
  }
];
