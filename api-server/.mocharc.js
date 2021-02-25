/**
 * @type {MochaSetupOptions}
 */
module.exports = {
  exit: true,
  package: './package.json',
  extension: ['ts'],
  require: ['tests/tsconfig.mocha.js'],
  timeout: 15000,
  'watch-files': ['src/**/*.ts', 'tests/integration/**/*.test.ts'],
};
