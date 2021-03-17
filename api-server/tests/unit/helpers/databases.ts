// Minimal set of dependencies required to get a database connection, no need to pull in
// stuff like redis, mail etc. as in integration suite

import databaseConfig from '@/config/database';
import logger from '@/services/logger';
import appConfig from '@/config/app';
import DB, { DbInterface } from '@/db';

let databases: DbInterface;

export async function initDatabases(): Promise<DbInterface> {
  console.info(
    `Using database ${databaseConfig.test.foods.database} on ${databaseConfig.test.foods.host}`
  );

  databases = new DB({
    environment: appConfig.env,
    databaseConfig,
    logger,
  });

  await databases.init();

  return databases;
}

export async function releaseDatabases(): Promise<void> {
  // Clean up the tables created by Sequelize to leave the database in the original blank state
  await databases.system.drop();
  await databases.foods.drop();

  // Close database connections to let jest test runner detect termination correctly
  await databases.system.close();
  await databases.foods.close();
}
