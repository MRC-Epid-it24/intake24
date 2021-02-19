module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/../common/src/$1'
  },
};
