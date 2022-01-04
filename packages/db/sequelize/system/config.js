const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve('../../apps/api/.env') });

module.exports = {
  development: {
    host: process.env.DB_SYSTEM_HOST,
    port: process.env.DB_SYSTEM_PORT,
    database: process.env.DB_SYSTEM_DATABASE,
    username: process.env.DB_SYSTEM_USERNAME,
    password: process.env.DB_SYSTEM_PASSWORD,
    dialect: process.env.DB_SYSTEM_DRIVER,
    migrationStorage: 'sequelize',
    migrationStorageTableName: 'sequelize_meta',
  },
  test: {
    host: process.env.DB_SYSTEM_HOST,
    port: process.env.DB_SYSTEM_PORT,
    database: process.env.DB_SYSTEM_DATABASE,
    username: process.env.DB_SYSTEM_USERNAME,
    password: process.env.DB_SYSTEM_PASSWORD,
    dialect: process.env.DB_SYSTEM_DRIVER,
    migrationStorage: 'sequelize',
    migrationStorageTableName: 'sequelize_meta',
  },
  production: {
    host: process.env.DB_SYSTEM_HOST,
    port: process.env.DB_SYSTEM_PORT,
    database: process.env.DB_SYSTEM_DATABASE,
    username: process.env.DB_SYSTEM_USERNAME,
    password: process.env.DB_SYSTEM_PASSWORD,
    dialect: process.env.DB_SYSTEM_DRIVER,
    migrationStorage: 'sequelize',
    migrationStorageTableName: 'sequelize_meta',
  },
};
