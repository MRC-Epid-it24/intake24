import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['jest-extended/all'],
  clearMocks: true,
  moduleNameMapper: {
    '^@intake24/api/(.*)$': '<rootDir>/src/$1',
    '^@intake24/api-tests/(.*)$': '<rootDir>/__tests__/$1',
    '^@intake24/common/(.*)$': '<rootDir>/../../packages/common/src/$1',
    '^@intake24/(.*?)$': '<rootDir>/../../packages/$1/src',
  },
  rootDir: '.',
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/(unit|integration)/**/*.(spec|test).ts'],
  testTimeout: 10000,
};

export default config;
