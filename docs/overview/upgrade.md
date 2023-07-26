# Upgrade guide

Intake24 V3 to V4 upgrade guide (WIP)

## Database migrations

Use most up-to-date V3 `foods` and `system` databases to run the migrations.

### Migrate system database

```sh
pnpm db:system:migrate
```

### Migrate foods database

```sh
pnpm db:foods:migrate
```

:::tip
Depending on size of the databases, migration process can take from seconds to minutes. Both databases are being upgraded to use int8 instead of int4, which takes most of the time.

If you run into query timeout issues, you will have to increase the limits in sequelize config file (`packages/db/sequelize/{foods|system}/config.js`).

:::

:::warning
Run the migration in specified order:

1. System database
2. Foods database

Some of the system database migrations are using foods database data (e.g. feedback data conversion into feedback-schemes) and eventually V3 old tables are dropped. Running the migrations in wrong order will fail.
:::

### Seed databases with relevant data

Some of V3 data are being moved to database. To get this data into the database, run relevant seeders.

#### Standard units

Standard units are being moved from V3 translation files to database. To seed the database with V3 source code standard units, run the following command:

```sh
cd packages/db

pnpm sequelize db:seed --seed v3-standard-portions.js --options-path sequelize/foods/options.js
```
