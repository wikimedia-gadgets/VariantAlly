// @ts-check

import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import globals from 'globals';

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    ignores: [
      '**/dist',
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    'rules': {
      'semi': 'error',
      'comma-dangle': [
        'error',
        'always-multiline',
      ],
      'quotes': [
        'error',
        'single',
        {
          'avoidEscape': true,
          'allowTemplateLiterals': true,
        },
      ],
      'max-len': [
        'error',
        {
          'code': 100,
          'ignoreComments': true,
          'ignoreStrings': true,
          'ignoreTemplateLiterals': true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          'argsIgnorePattern': '_',
        },
      ],
      'vue/multiline-html-element-content-newline': 'off',
    },
  },
);
