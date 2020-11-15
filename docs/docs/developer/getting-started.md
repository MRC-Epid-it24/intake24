# Getting started

Clone the [Intake24 version 4 repository on GitHub](https://github.com/MRC-Epid-it24/intake24).

Follow the readme instructions in the root of the repository.

## Databases

Standalone database snapshots are currently unavailable, please use the [development virtual machine](/developer/vm.html). 

## API server

Go to `api-server` and follow instructions in the readme file.

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
