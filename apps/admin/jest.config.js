module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  setupFilesAfterEnv: ['jest-extended/all'],
  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/../../packages/common/src/$1',
  },
};
