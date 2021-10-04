# Getting started

## Dev instance

Steps to getting a local instance running

* Run Dev VM (download from S3 bucket - contact the Intake24 team), which maps out the database on 192.168.56.10:5432 (PostgreSQL). Start this VM.
* Clone the master repository from Github [link](https://github.com/MRC-Epid-it24/intake24)
* Follow instructions to README to install node modules (e.g. `npm install` on each folder)
* Local servers need to be run for `api`, `admin` and `survey` from each respective folder:
  * To start `api`: `npm run dev`
  * To start `admin` and `survey`: `npm run serve` for live reloads

::: tip
Authentication uses cookies, so separate browser sessions will be required to use both `admin` and `survey` interfaces at the same time.
:::

## Useful tools

* IDE for developing Node, Typescript, npm and associated tooling (e.g. VS Code)
* Virtual Box (v6.x minimum) for running database VM
* Database browser (e.g. DBeaver) for exploring/manipulating PostgreSQL DB.

::: tip
Intake24 requires node.js version 12 or newer, please make sure to check your node.js version before continuing.
:::

Clone the [Intake24 version 4 repository on GitHub](https://github.com/MRC-Epid-it24/intake24).

Follow the readme instructions in the root of the repository.

## Databases

Standalone database snapshots are currently unavailable, please use the [development virtual machine](/developer/vm.html). 

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
- `QUEUE_REDIS_HOST` —  set to `192.168.56.4` if using the development VM or alternatively point to your own Redis 
instance.

Check that the settings are correct by starting the server with `npm run dev`.

## API access

The default user with superuser rights is `admin` and the password is `intake24`. Refer to the [API docs](/api/) for 
further details.

::: tip
Use the e-mail log in endpoint (`/api/login`) for the admin user even though "admin" is not a valid e-mail address.
:::
