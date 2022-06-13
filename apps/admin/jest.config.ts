import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  // preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  setupFilesAfterEnv: ['jest-extended/all'],
  moduleNameMapper: {
    '^@intake24/common/(.*)$': '<rootDir>/../../packages/common/src/$1',
  },
};

export default config;
