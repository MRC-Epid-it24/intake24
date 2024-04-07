const path = require('node:path');

module.exports = {
  config: path.resolve('./sequelize/foods', 'config.js'),
  'models-path': path.resolve('./src/db/models/foods'),
  'migrations-path': path.resolve('./sequelize/foods/migrations'),
  'seeders-path': path.resolve('./sequelize/foods/seeders'),
};
