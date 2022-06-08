import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['jest-extended/all'],
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.ts'],
  moduleNameMapper: {
    '^@intake24/portal/(.*)$': '<rootDir>/src/$1',
    // Packages not importing to top-level
    '^@intake24/common/(.*)$': '<rootDir>/../../packages/common/src/$1',
    '^@intake24/common-backend/(.*)$': '<rootDir>/../../packages/common-backend/src/$1',
    // Rest of the packages importing to top-level
    '^@intake24/(.*?)$': '<rootDir>/../../packages/$1/src',
  },
  rootDir: '.',
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.(spec|test).ts'],
  testTimeout: 10000,
};

export default config;
