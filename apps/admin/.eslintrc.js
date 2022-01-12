module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    'import/no-cycle': 'warn',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-await-in-loop': 'off',
    'no-continue': 'off',
    'no-param-reassign': 'warn',
    'no-plusplus': 'off',
    'no-restricted-globals': 'warn',
    'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
    'no-shadow': 'off',
    'vue/multi-word-component-names': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-unused-vars': ['warn', { ignoreRestSiblings: true }],
  },
  overrides: [
    {
      files: ['__tests__/**/*.{j,t}s?(x)', '__tests__/**/*.spec.{j,t}s?(x)'],
      env: { jest: true },
    },
  ],
};
