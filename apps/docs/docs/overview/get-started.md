# Get started

This section briefly describes how to configure, build and start the Intake24 components.

## API Server

Navigate to `apps/api` directory.

```sh
cd apps/api
```

Copy template of configuration file and edit it as required. Please see [Configuration](/config/) section for detailed description of configuration options.

```sh
cp .env-template .env
```

Build the application

```
pnpm run prod
```

Start the application

```
pnpm run start
```

### For production, consider:

1) Deploy as dedicated service. Refer to your OS environment how to set that up.
2) User process manager, e.g. [PM2](https://pm2.keymetrics.io)
3) Deploy behind proper http server, e.g. [Nginx](https://www.nginx.com), [Apache](https://www.apache.org) etc.

Deployment section / ansible scripts provide examples how to use dedicated service on Ubuntu and run it behind Nginx reverse proxy.

### Database migrations

- project is using [sequelize-cli](https://github.com/sequelize/cli)
- database layer is located in `packages/db`
- config / migration files (per database) are store in respective `packages/db/sequelize/{database}` folders

Migrations can be executed from root-level or package level with following commands
```sh
pnpm run migrate:foods

pnpm run migrate:system
```

## Admin client

Navigate to `apps/admin` directory.

```sh
cd apps/admin
```

Copy template of configuration file and edit it as required. Please see [Configuration](/config/) section for detailed description of configuration options.

```sh
cp .env-template .env
```

Build the application

```
pnpm run build
```

Start the application

```
pnpm run start
```

:::tip
This should only be used if you host the client on separate domain. It will start separate http server to serve the application.
:::

Serve the application locally in development mode with hot-reload

```
pnpm run serve
```

## Survey client

Navigate to `apps/survey` directory.

```sh
cd apps/survey
```

Copy template of configuration file and edit it as required. Please see [Configuration](/config/) section for detailed description of configuration options.

```sh
cp .env-template .env
```

Build the application

```
pnpm run build
```

Start the application

```
pnpm run start
```

:::tip
This should only be used if you host the client on separate domain. It will start separate http server to serve the application.
:::

Serve the application locally in development mode with hot-reload

```
pnpm run serve
```

## Documentation

Documentation is built with [vuepress](https://vuepress.vuejs.org).

:::warning
Currently `docs` is still using `npm` to install dependencies as there is an issue with `pnpm` and correctly resolving webpack version through `vue-server-renderer`.
:::

Navigate to `apps/docs` directory.

```sh
cd apps/survey
```

Install dependencies using `npm`.

```sh
npm install
```

Copy template of configuration file and edit it as required. Please see [Configuration](/config/) section for detailed description of configuration options.

```sh
cp .env-template .env
```

Serve the application locally in development mode with hot-reload

```
pnpm run serve
```

:::tip
Documentation is automatically rebuild and deployed to dedicated site whenever source code is updated.
:::