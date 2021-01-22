/**
 * @type {MochaSetupOptions}
 */
module.exports = {
  exit: true,
  package: './package.json',
  extension: ['ts'],
  require: ['tests/tsconfig.mocha.js'],
  'watch-files': ['tests/integration/**/*.test.ts'],
};
