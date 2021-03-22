module.exports = {
  root: true,
  env: {
    browser: false,
    commonjs: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  settings: {
    'import/extensions': ['.ts'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.ts'],
      },
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  plugins: ['import', 'prettier', '@typescript-eslint'],
  rules: {
    'prettier/prettier': 'error',
    'import/no-cycle': 'warn',
    'no-await-in-loop': 'off',
    'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
    'no-console': 'warn',
    'no-continue': 'off',
    'no-debugger': 'warn',
    'no-plusplus': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'prefer-default-export': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
      },
    ],
  },
};
