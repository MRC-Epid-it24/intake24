module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
  ],
  plugins: ['import', 'simple-import-sort'],
  rules: {
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^\\u0000'],
          ['^node:'],
          ['^@?(?!intake24)\\w.*\\u0000$', '^@?(?!intake24)\\w'],
          ['(?<=\\u0000)$', '^'],
          ['^\\..*\\u0000$', '^\\.'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    'vue/attributes-order': ['error', { alphabetical: true }],
    'vue/multi-word-component-names': 'warn',
    'vue/no-setup-props-destructure': 'warn',
    'vue/require-default-prop': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports', disallowTypeAnnotations: false },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { ignoreRestSiblings: true }],
  },
  overrides: [
    {
      files: ['__tests__/**/*.{j,t}s?(x)', '__tests__/**/*.spec.{j,t}s?(x)'],
      env: { jest: true },
    },
  ],
};
