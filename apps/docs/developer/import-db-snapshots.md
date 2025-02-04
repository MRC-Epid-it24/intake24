# Import database snapshots

If you have a DB snapshots of Intake24, you can use CLI to import to the database server.

## PostgreSQL

PostgreSQL is running on the standard port `5432`.

The Intake24 databases are:

- System database: `intake24_system`, user `intake24`, no password.
- Foods database: `intake24_foods`, user `intake24`, no password.

## Importing foods and system databases

::: warning
Note: The scripts in this sessions aimed for setup PostgreSQL for Intake24 local development purpose only.
:::

1. Export PostgresQL username password and host name to local development environment.

```
export PGUSER='postgres'
export PGPASSWORD='postgres'
export PGHOST="localhost"
```

2. Create a user in Postgres called `intake24` with password `intake24`

```
psql -d postgres -c "CREATE ROLE intake24 WITH PASSWORD 'intake24' LOGIN;"
```

3. Create DB `intake24_foods` and add extensions

```
createdb --owner=intake24 intake24_foods
psql -d intake24_foods -c "create extension btree_gist"
psql -d intake24_foods -c "create extension \"uuid-ossp\""
```

4. Import snapshot file to DB `intake24_foods`

```
pg_restore -n public --no-owner --no-acl --role=intake24 --dbname intake24_foods ./intake24-foods-snapshot.pgcustom
```

Change the path of the snapshot file as needed, e.g. `intake24-foods-snapshot.pgcustom`

5. Create DB `intake24_system`

```
createdb --owner=intake24 intake24_system
```

6. Import snapshot file to DB `intake24_system`.

```
pg_restore -n public --no-owner --no-acl --role=intake24 --dbname intake24_system ./intake24-system-snapshot.pgcustom
```

Change the path of the snapshot file as needed, e.g. `intake24-system-snapshot.pgcustom`

7. Login to `intake24_system` using PSQL, and insert admin user (e.g. `admin@example.com`, or any email you prefer) to `users` table.

Write down return user id. It will be useful in the next step.

```
psql -d intake24_system

insert into users (id, "name", email, phone, simple_name, email_notifications, sms_notifications, multi_factor_authentication, created_at, updated_at, verified_at, disabled_at) values (default, 'Admin', 'admin@example.com', '', 'Admin', true, true, false, now(), now(), now(), null) returning id;
```

```
id
-------
11969
(1 row)
```

8. Go to the `apps/cli` directory in the source tree and run

```
pnpm run cli hash-password [your password]
```

Replace `[your password]` to the password you want.

9. Replace `[hash]` and `[salt]` with the password hash and salt generated, and insert to user by id.

```
insert into user_passwords (user_id, password_hash, password_salt, password_hasher) values (11969, '[hash]', '[salt]', 'bcrypt');
```

10. Give this user id superuser permissions:

```
insert into role_user (role_id, user_id, created_at, updated_at) values (1, 11969, now(), now());
```

By that you created admin test account `admin@example.com` in development database.
