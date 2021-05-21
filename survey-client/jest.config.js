module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  setupFilesAfterEnv: ['jest-extended'],
  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/../common/src/$1',
  },
  setupFiles: ['<rootDir>/tests/unit/index.js'],
};
