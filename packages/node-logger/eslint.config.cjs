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
  }
];
