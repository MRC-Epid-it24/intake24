export default {
  development: {
    databases: {
      system: {
        host: process.env.DB_SYSTEM_HOST,
        port: process.env.DB_SYSTEM_PORT,
        database: process.env.DB_SYSTEM_DATABASE,
        username: process.env.DB_SYSTEM_USERNAME,
        password: process.env.DB_SYSTEM_PASSWORD,
        dialect: process.env.DB_SYSTEM_DRIVER,
      },
      foods: {
        host: process.env.DB_FOODS_HOST,
        port: process.env.DB_FOODS_PORT,
        database: process.env.DB_FOODS_DATABASE,
        username: process.env.DB_FOODS_USERNAME,
        password: process.env.DB_FOODS_PASSWORD,
        dialect: process.env.DB_FOODS_DRIVER,
      },
    },
  },
  test: {
    databases: {
      system: {
        host: process.env.DB_SYSTEM_HOST,
        port: process.env.DB_SYSTEM_PORT,
        database: process.env.DB_SYSTEM_DATABASE,
        username: process.env.DB_SYSTEM_USERNAME,
        password: process.env.DB_SYSTEM_PASSWORD,
        dialect: process.env.DB_SYSTEM_DRIVER,
      },
      foods: {
        host: process.env.DB_FOODS_HOST,
        port: process.env.DB_FOODS_PORT,
        database: process.env.DB_FOODS_DATABASE,
        username: process.env.DB_FOODS_USERNAME,
        password: process.env.DB_FOODS_PASSWORD,
        dialect: process.env.DB_FOODS_DRIVER,
      },
    },
  },
  production: {
    databases: {
      system: {
        host: process.env.DB_SYSTEM_HOST,
        port: process.env.DB_SYSTEM_PORT,
        database: process.env.DB_SYSTEM_DATABASE,
        username: process.env.DB_SYSTEM_USERNAME,
        password: process.env.DB_SYSTEM_PASSWORD,
        dialect: process.env.DB_SYSTEM_DRIVER,
      },
      foods: {
        host: process.env.DB_FOODS_HOST,
        port: process.env.DB_FOODS_PORT,
        database: process.env.DB_FOODS_DATABASE,
        username: process.env.DB_FOODS_USERNAME,
        password: process.env.DB_FOODS_PASSWORD,
        dialect: process.env.DB_FOODS_DRIVER,
      },
    },
  },
};
