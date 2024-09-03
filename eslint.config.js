import antfu from '@antfu/eslint-config';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default await antfu({
  stylistic: {
    semi: true,
  },
  markdown: false,
  vue: {
    vueVersion: 2,
  },
  formatters: true,
  ignores: [
    'deployment',
    '**/public',
    'apps/api/src/food-index/language-backends/en/metaphone3.ts',
  ],
}, {
  plugins: {
    'simple-import-sort': simpleImportSort,
  },
  rules: {
    'import/order': 'off',
    'no-console': 'off',
    'node/prefer-global/buffer': ['error', 'always'],
    'node/prefer-global/process': ['error', 'always'],
    'unused-imports/no-unused-vars': ['error', {
      ignoreRestSiblings: true,
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    'jsdoc/require-returns-description': 'off',
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
    'sort-imports': 'off',
    'style/quote-props': ['error', 'as-needed'],
    'style/member-delimiter-style': ['error', { multiline: { delimiter: 'semi' }, singleline: { delimiter: 'semi' } }],
    'ts/ban-types': 'off',
    'ts/consistent-type-imports': 'off',
    'ts/consistent-type-definitions': 'off',
    'ts/no-explicit-any': 'off',
    'ts/no-use-before-define': 'warn',
    'unicorn/consistent-function-scoping': 'off',
    'vue/attributes-order': ['error', { alphabetical: true }],
    'vue/block-order': ['error', { order: [['script', 'template'], 'style'] }],
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/custom-event-name-casing': 'off',
    'vue/multi-word-component-names': 'warn',
    'vue/no-unused-refs': 'off', // remove with Vue 3
    'vue/no-setup-props-destructure': 'warn',
    'vue/require-default-prop': 'off',
    'vue/valid-v-slot': ['error', { allowModifiers: true }],
  },
});
