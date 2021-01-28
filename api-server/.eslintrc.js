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
    'plugin:chai-friendly/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  plugins: ['import', 'prettier', '@typescript-eslint', 'mocha'],
  rules: {
    'prettier/prettier': 'error',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
      },
    ],
    'import/no-cycle': 'warn',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.config.js', '**/*.mocha.js', 'tests/**/*.ts', 'tests/**/*.js'] },
    ],
    'no-await-in-loop': 'off',
    'no-continue': 'off',
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-plusplus': 'off',
    'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
    'no-shadow': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-shadow': 'error',
  },
  overrides: [
    {
      files: ['tests/**/*.ts', 'tests/**/*.js'],
      rules: {
        'func-names': 'off',
        'mocha/no-exports': 'off',
        'mocha/no-top-level-hooks': 'off',
      },
    },
    {
      files: ['**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
