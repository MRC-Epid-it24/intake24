/**
 * @type {MochaSetupOptions}
 */
module.exports = {
  exit: true,
  package: './package.json',
  extension: ['ts'],
  require: ['tests/tsconfig.mocha.js'],
  timeout: 15000,
  'watch-files': ['tests/integration/**/*.test.ts'],
};
