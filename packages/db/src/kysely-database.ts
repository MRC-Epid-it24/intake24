import type { Dialect, Logger as KyselyLogFunc } from 'kysely';
import type { LogEvent } from 'kysely/dist/cjs/util/log';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import type { Logger } from '@intake24/common-backend';
import type { DatabaseOptions } from '@intake24/db/database';
import type { FoodsDB, SystemDB } from '@intake24/db/kysely';

import type { DatabaseType } from './config';

function databaseLogQuery(sql: string, logger: Logger, limit: number) {
  if (limit > 0 && sql.length > limit) {
    logger.debug(sql.substring(0, limit) + '...');
  } else {
    logger.debug(sql);
  }
}
export class KyselyDatabases {
  private readonly config;

  private readonly env;

  private readonly poolLogger: Logger;

  private readonly dbLogger: Logger;

  public foods!: Kysely<FoodsDB>;

  public system!: Kysely<SystemDB>;

  constructor({ environment, databaseConfig, logger }: DatabaseOptions) {
    this.env = environment;
    this.config = databaseConfig;
    this.poolLogger = logger.child({ service: 'Kysely connection pool' });
    this.dbLogger = logger.child({ service: 'Kysely DB' });
  }

  private configKyselyDialect(database: DatabaseType): Dialect {
    // Postgres hard-coded for experimental Kysely code, in case we decide to keep using it
    // return the correct dialect type based on the database config

    return new PostgresDialect({
      pool: new Pool({
        database: this.config[this.env][database].database,
        host: this.config[this.env][database].host,
        port: this.config[this.env][database].port,
        user: this.config[this.env][database].username,
        password: this.config[this.env][database].password,
        max: 10,
        log: (...messages: any[]) => this.poolLogger.debug(messages.join('; ')),
      }),
    });
  }

  configLogger(database: DatabaseType): KyselyLogFunc {
    if (this.env === 'development')
      return (event: LogEvent): void => {
        switch (event.level) {
          case 'query':
            databaseLogQuery(
              `Query [${event.queryDurationMillis.toFixed(1)} ms]: ${event.query.sql}`,
              this.dbLogger,
              this.config[this.env][database].debugQueryLimit
            );
            databaseLogQuery(
              `└ Parameters: ${event.query.parameters.join(', ')}`,
              this.dbLogger,
              this.config[this.env][database].debugQueryLimit
            );
            break;
          case 'error':
            this.dbLogger.error(event.error);
            break;
        }
      };
    else
      return (event: LogEvent): void => {
        switch (event.level) {
          case 'query':
            break;
          case 'error':
            this.dbLogger.error(event.error);
            break;
        }
      };
  }

  init() {
    this.foods = new Kysely<FoodsDB>({
      dialect: this.configKyselyDialect('foods'),
      log: this.configLogger('foods'),
      plugins: [new CamelCasePlugin()],
    });
    this.system = new Kysely<SystemDB>({
      dialect: this.configKyselyDialect('system'),
      log: this.configLogger('system'),
      plugins: [new CamelCasePlugin()],
    });
  }

  async close() {
    await Promise.all([this.foods.destroy(), this.system.destroy()]);
  }
}
