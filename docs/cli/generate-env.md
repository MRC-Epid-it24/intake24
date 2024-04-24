# Generate .env files

This command allows to quickly generate `.env` files for each application (`api`, `admin` and `survey`) when setting up the application for the first time.

It copies `.env-templates` to `.env` and generates couple of application secrets + VAPID keys.

```sh
pnpm cli generate-env
```

If files already exist, command will stop. To override the existing files, run the command with `-f` or `--force` option.

```sh
pnpm cli generate-env --force
```
