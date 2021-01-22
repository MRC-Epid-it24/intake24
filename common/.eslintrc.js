module.exports = {
  root: true,
  env: {
    browser: false,
    commonjs: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 2020,
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
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  plugins: ['import', 'prettier', '@typescript-eslint'],
  rules: {
    'prettier/prettier': 'error',
    'import/no-cycle': 'warn',
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-shadow': 'off',
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
