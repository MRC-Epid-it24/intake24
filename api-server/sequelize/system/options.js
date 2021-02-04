const path = require('path');

module.exports = {
  config: path.resolve('./sequelize/system', 'config.js'),
  'models-path': path.resolve('./src/db/models/system'),
  'migrations-path': path.resolve('./sequelize/system/migrations'),
  'seeders-path': path.resolve('./sequelize/system/seeders'),
};
