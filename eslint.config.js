// eslint.config.js
const { defineConfig } = require('eslint/config');
const jsPlugin = require('@eslint/js');
const tsPlugin = require('typescript-eslint');
const nodePlugin = require('eslint-plugin-n');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  jsPlugin.configs.recommended,
  nodePlugin.configs['flat/recommended-script'],
  tsPlugin.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      'node_modules',
      'dist',
      'typings',
      'public/**/**',
      'view/**/**',
      'packages',
    ],
    languageOptions: {
      parser: tsPlugin.parser,
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
      },
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-warning-comments': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/camelcase': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',

      // Node rules
      'n/no-unsupported-features/node-builtins': 'off',
      'n/no-unsupported-features/es-syntax': 'off',
      'n/no-extraneous-require': 'off',
      'n/no-unpublished-import': 'off',
      'n/no-extraneous-import': 'off',
      'n/no-missing-require': 'off',
      'n/no-missing-import': 'off',
      'n/no-empty-function': 'off',
      'n/shebang': 'off',

      // Prettier
      'prettier/prettier': 'error',

      // Base rules
      quotes: ['warn', 'single', { avoidEscape: true }],
      'prefer-arrow-callback': 'error',
      'require-atomic-updates': 'off',
      'no-constant-condition': 'off',
      'no-dupe-class-members': 'off',
      'no-trailing-spaces': 'error',
      'block-scoped-var': 'error',
      'no-control-regex': 'off',
      'no-process-exit': 'off',
      'prefer-const': 'off',
      'eol-last': 'error',
      'no-empty': 'off',
      'no-var': 'error',
      'no-self-assign': 'off',
      'no-useless-catch': 'off',
      eqeqeq: 'off',
    },
  },
]);
