# Database

Path: `packages/db/src/config.ts`

System consists of two databases:

* Foods - stores food-related information, mostly static content
* System - stores users/surveys related information, system configuration etc

Connection info is defined per-environment (`development`, `test`, `production`) and per-database (`foods` and `system`).

Path: `src/config/database.ts`

## Host

* object-path: `[environment][database].host`
* dotenv var: `DB_FOODS_HOST` and `DB_SYSTEM_HOST`
* type: `string`
* default: `'localhost'`

## Port

* object-path: `[environment][database].port`
* dotenv var: `DB_FOODS_PORT` and `DB_SYSTEM_PORT`
* type: `number`
* default: `5432`

## Database

* object-path: `[environment][database].database`
* dotenv var: `DB_FOODS_DATABASE` and `DB_SYSTEM_DATABASE`
* type: `string`
* default: `'intake24_foods'` and `'intake24_system'`

## Username

* object-path: `[environment][database].username`
* dotenv var: `DB_FOODS_USERNAME` and `DB_SYSTEM_USERNAME`
* type: `string`
* default: `'intake24'`

## Password

* object-path: `[environment][database].password`
* dotenv var: `DB_FOODS_PASSWORD` and `DB_SYSTEM_PASSWORD`
* type: `string`
* default: `''`

## Dialect

* object-path: `[environment][database].dialect`
* dotenv var: `DB_FOODS_DRIVER` and `DB_SYSTEM_DRIVER`
* type: `'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql'`
* default: `'postgres'`
