# Getting started

## Dev instance

Steps to getting a local instance running

- Run Dev VM (download from S3 bucket - contact the Intake24 team), which maps out the database on 192.168.56.10:5432 (PostgreSQL). Start this VM.
- Alternatively, obtain database snapshots from the intake24 team and import them into a database (e.g. DBeaver). Please check the guidance on [importing database snapshots with DBeaver](https://dbeaver.com/docs/wiki/Backup-Restore/).
- Local servers need to be run for `api`, `admin` and `survey` from each respective folder:
- To start `api` / `admin` / `survey`: `pnpm dev` for live reloads

## Useful tools

- IDE for developing Node, Typescript, npm and associated tooling (e.g. VS Code)
- Virtual Box (v6.x minimum) for running database VM
- Database browser (e.g. DBeaver) for exploring/manipulating PostgreSQL DB.
- Redis

::: tip
Intake24 requires node.js version 16 or newer, please make sure to check your node.js version before continuing.
:::

Clone the [Intake24 version 4 repository on GitHub](https://github.com/MRC-Epid-it24/intake24).

Follow the readme instructions in the root of the repository.

## Databases

Please contact the intake24 team for the latest development virtual machine. [Please also check the guidance on using the development virtual machine](https://docs.intake24.org/developer/vm).
Alternatively, obtain database snapshots from the intake24 team and import them into a database browser (e.g. DBeaver). Please check the guidance on [importing database snapshots with DBeaver](https://dbeaver.com/docs/wiki/Backup-Restore/). While using the database snapshots, don't forget to set up your own Redis instance.

## API server

Go to `api` and follow instructions in the readme file.

Copy the `.env-template` file to `.env` and change the following settings:

- `JWT_ACCESS_SECRET` — set to any string (security doesn't matter for development purposes), e.g. `verybigsecret`,
- `JWS_REFRESH_SECRET` — same as above but use a different secret,
- `DB_SYSTEM_HOST` — set to `192.168.56.4` if using the development VM or alternatively point to your own database
  instance,
- `DB_SYSTEM_PORT`, `DB_SYSTEM_USERNAME`, `DB_SYSTEM_PASSWORD` — keep the default settings if using the VM or edit
  according to your own DB settings,
- `DB_FOODS_HOST` — set to `192.168.56.4` if using the development VM or alternatively point to your own database
  instance,
- `DB_FOODS_PORT`, `DB_FOODS_USERNAME`, `DB_FOODS_PASSWORD` — keep the default settings if using the VM or edit
  according to your own DB settings,
- `QUEUE_REDIS_HOST` — set to `192.168.56.4` if using the development VM or alternatively point to your own Redis
  instance.

Check that the settings are correct by starting the server with `pnpm dev`.

:::tip
Add `DB_DEV_SYSTEM_DEBUG_QUERY_LIMIT=500` and `DB_DEV_FOODS_DEBUG_QUERY_LIMIT=500` to the API `.env` file to limit debug query char limit. It can prevent long queries from cluttering the console. The API server runs food indexing each time it starts so the console outputs can be quite a lot. The server does that for all locales in the food database, so for the DEV instance, you can also limit number of locales it runs against in `.env` by setting `APP_ENABLED_LOCALES = ["UK_V2_2022"]`.
:::

## API access

If you had your account already created in the databse snapshot you are using, please add your email in DBeaver `users` tables, then go to `apps/cli`, and run `pnpm cli:dev hash-password yourNewPassword`.
Grab the hash and put it manually into the `password_hash` column of the `user_passwords` table for your user record (find you user_id in users).
There will be a cli command available to create a whole new account without this manual hassle.
