# Database

- [Sequelize](https://sequelize.org) ORM is used for database layer, any of supported dialects can be used.

::: warning
Older version (v3) has been written only for Postgres and there are still few Postgres specifics that needs to be ported to dialect-agnostic code. Please contact Intake24 dev team for more details about current state of DB engines support.
:::

Intake24 system has two main databases:

- `foods` - contains all foods related data (e.g. foods, food groups, nutrients, etc.)
- `system` - contains all system related data (e.g. users, permissions, roles, feedback schemes, surveys, etc.)

## Database migrations

Database migrations are being handled by [sequelize](https://sequelize.org/). Please see [sequelize-cli](https://sequelize.org/docs/v6/other-topics/migrations) docs for more details.

### Migrate system database

Migration commands can be being executed either from `project root` or `packages/db` directory.

```sh
pnpm db:system:migrate

# shorthand for

pnpm sequelize db:migrate --options-path sequelize/system/options.js
```

### Migrate foods database

```sh
pnpm db:foods:migrate

# shorthand for

pnpm sequelize db:migrate --options-path sequelize/foods/options.js
```

## Upgrade guide

Intake24 V3 to V4 upgrade guide (WIP)

### Migrate databases

Use most up-to-date V3 `foods` and `system` databases to run the migrations.

1. Migrate system database

```sh
pnpm db:system:migrate
```

2. Migrate foods database

```sh
pnpm db:foods:migrate
```

:::tip
Depending on size of the databases, migration process can take from seconds to minutes. Both databases are being upgraded to use int8 instead of int4, which takes most of the time.

If you run into query timeout issues, you will have to increase the limits in sequelize config file (`packages/db/sequelize/{foods|system}/config.js`).

:::

:::warning
Run the migration in specified order per above.

Some of the system database migrations are using foods database data (e.g. feedback data conversion into feedback-schemes) and eventually V3 old tables are dropped. Running the migrations in wrong order will fail.
:::

### Seed databases with relevant data

Some of V3 data are being moved to database. To get this data into the database, run relevant seeders.

#### Standard units

Standard units are being moved from V3 translation files to database. To seed the database with V3 source code standard units, run the following command:

```sh
cd packages/db

pnpm sequelize db:seed --seed v3-standard-units.js --options-path sequelize/foods/options.js
```

## System database clean-up

### Truncate all tables except `sequelize_meta`

```sql
TRUNCATE TABLE `table` RESTART IDENTITY CASCADE;
```

### Seed ACL data

```sh
cd packages/db

pnpm sequelize db:seed --seed populate-acl.js --options-path sequelize/system/options.js
```

:::danger
Seeder truncates all `permissions` / `roles` / `users` tables with `CASCADE`.
:::

Seeder will create:

- creates all available permissions
- creates `superuser` role with all permissions assigned
- creates `admin` user with `superuser` role assigned

:::warning
`admin` user is being created with `admin` password.

**After first login:**

1. Change password
2. Set own email in order to restore password in future

:::

### Copy over duplicated food data

WIP - to be automated

1. `food_index_language_backends` - all language codes in `food_index_language_backend_id` column of `locales` table need to be created
2. `languages` - all language codes that are present in locales table record need to be created
3. `locales`
4. `nutrient_units` - copy over all records from `nutrient_units` table
5. `nutrient_types` - copy over all records from `nutrient_types` table
