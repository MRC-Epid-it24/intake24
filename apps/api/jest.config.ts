export default {
  clearMocks: true,
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleNameMapper: {
    '^@api/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^@common/(.*)$': '<rootDir>/../../packages/common/src/$1',
  },
  rootDir: '.',
  roots: ['<rootDir>/tests'],
  setupFilesAfterEnv: ['jest-extended/all'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/tests/(unit|integration)/**/*.test.ts'],
  testTimeout: 10000,
};
