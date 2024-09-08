import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['jest-extended/all'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@intake24/common/(.*?)$': '<rootDir>/../common/src/$1',
    '^@intake24/common-backend/(.*?)$': '<rootDir>/../common-backend/src/$1',
    '^@intake24/(.*?)$': '<rootDir>/../$1/src',
  },
  rootDir: '.',
};

export default config;
