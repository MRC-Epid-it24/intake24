export default {
  clearMocks: true,
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@api-server/(.*)$': '<rootDir>/src/$1',
    '^@common/(.*)$': '<rootDir>/../common/src/$1',
  },
  rootDir: '.',
  roots: ['<rootDir>/tests'],
  setupFilesAfterEnv: ['jest-extended'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/tests/(unit|integration)/**/*.test.ts'],
};
