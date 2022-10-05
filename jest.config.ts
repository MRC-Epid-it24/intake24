import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['jest-extended/all'],
  testEnvironment: 'node',
  clearMocks: true,
  moduleNameMapper: {
    '^@intake24/api/(.*?)$': '<rootDir>/apps/api/src/$1',
    '^@intake24/api-tests/(.*)$': '<rootDir>/apps/api/__tests__/$1',
    '^@intake24/admin/(.*?)$': '<rootDir>/apps/admin/src/$1',
    '^@intake24/cli/(.*?)$': '<rootDir>/apps/cli/src/$1',
    '^@intake24/survey/(.*?)$': '<rootDir>/apps/survey/src/$1',
    '^@intake24/common/(.*?)$': '<rootDir>/packages/common/src/$1',
    '^@intake24/common-backend/(.*?)$': '<rootDir>/packages/common-backend/src/$1',
    '^@intake24/(.*?)/(.*?)$': '<rootDir>/packages/$1/src/$2',
  },
  rootDir: '.',
  testMatch: [
    '<rootDir>/apps/api/__tests__/unit/**/*.spec.ts',
    '<rootDir>/packages/**/__tests__/**/*.spec.ts',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/apps/api/__tests__/integration/'],
  testTimeout: 10000,
  watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
};

export default config;
