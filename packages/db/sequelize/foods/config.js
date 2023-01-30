const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve('../../apps/api/.env') });

module.exports = {
  development: {
    host: process.env.DB_DEV_FOODS_HOST,
    port: process.env.DB_DEV_FOODS_PORT,
    database: process.env.DB_DEV_FOODS_DATABASE,
    username: process.env.DB_DEV_FOODS_USERNAME,
    password: process.env.DB_DEV_FOODS_PASSWORD,
    dialect: process.env.DB_DEV_FOODS_DRIVER,
    migrationStorage: 'sequelize',
    migrationStorageTableName: 'sequelize_meta',
  },
  test: {
    host: process.env.DB_TEST_FOODS_HOST,
    port: process.env.DB_TEST_FOODS_PORT,
    database: process.env.DB_TEST_FOODS_DATABASE,
    username: process.env.DB_TEST_FOODS_USERNAME,
    password: process.env.DB_TEST_FOODS_PASSWORD,
    dialect: process.env.DB_TEST_FOODS_DRIVER,
    migrationStorage: 'sequelize',
    migrationStorageTableName: 'sequelize_meta',
  },
  production: {
    host: process.env.DB_FOODS_HOST,
    port: process.env.DB_FOODS_PORT,
    database: process.env.DB_FOODS_DATABASE,
    username: process.env.DB_FOODS_USERNAME,
    password: process.env.DB_FOODS_PASSWORD,
    dialect: process.env.DB_FOODS_DRIVER,
    migrationStorage: 'sequelize',
    migrationStorageTableName: 'sequelize_meta',
  },
};
