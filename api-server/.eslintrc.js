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
    'plugin:mocha/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  plugins: ['import', 'prettier', '@typescript-eslint', 'mocha'],
  rules: {
    'prettier/prettier': 'error',
    'import/no-cycle': 'warn',
    'no-console': 'warn',
    'no-debugger': 'warn',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.ts', '**/*.spec.ts'] },
    ],
    'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.test.ts'],
      rules: {
        'func-names': 'off',
        'mocha/no-exports': 'off',
      },
    },
  ],
};
