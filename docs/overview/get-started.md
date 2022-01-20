# Get started

This section briefly describes how to configure, build and start the Intake24 components.

## Repository

Clone the repository
```sh
git clone https://github.com/MRC-Epid-it24/intake24
```

Repository is set as mono-repository with [workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).

Shared components are in `packages` folder. Applications are in `apps` folder.

Install `pnpm` using built-in `npm` (see [pnpm docs](https://pnpm.io) for further options).

```sh
npm install -g pnpm
```

Install project dependencies

```sh
pnpm install
```

Set up `.env` file for each application you want to build, see below.

```sh
cd apps/{app}

cp .env-template .env

nano .env
```

Build all applications
- run command either from top-level to build all `api`, `cli`, `admin` and `survey`.
- run command from `apps/{app}` folder to build specific application

```sh
pnpm build
```

:::tip Environment variables
Code is using `.env ` environment files. Each project contains a template file (`.env-template`). If you're setting up fresh project, you can run CLI command, which generates all the files and couple of required specific keys. Follow the [CLI instructions](/overview/cli/) and how to run [generate-env](/overview/cli/generate-env).

Some of the environment variables are either bundled in or used to configure build of SPA applications. Make sure you set up those `.env` file before running build for SPAs.
:::

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

```sh
pnpm build
```

Start the application

```sh
pnpm start
```

:::tip For production, consider
1) Deploying as dedicated service. Refer to your OS environment how to set that up.
2) User process manager, e.g. [PM2](https://pm2.keymetrics.io)
3) Deploy behind proper http server, e.g. [Nginx](https://www.nginx.com), [Apache](https://www.apache.org) etc.
:::

Deployment section / ansible scripts provide examples how to use dedicated service on Ubuntu and run it behind Nginx reverse proxy.

## Database

- project is using [sequelize-cli](https://github.com/sequelize/cli)
- database layer is located in `packages/db`
- config / migration files (per database) are store in respective `packages/db/sequelize/{database}` folders

Set up `.env` file if running independently of API server so it can load connection details

```sh
cp .env-template .env
```

Migrations can be executed from root-level or package level with following commands

```sh
# both databases
pnpm db:migrate

# or each database

# foods
pnpm db:migrate:foods

# system
pnpm db:migrate:system
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

```sh
pnpm build
```

Start the application

```sh
pnpm start
```

:::tip
This should only be used if you host the client on separate domain. It will start separate http server to serve the application.
:::

Serve the application locally in development mode with hot-reload

```sh
pnpm dev
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

```sh
pnpm build
```

Start the application

```sh
pnpm start
```

:::tip
This should only be used if you host the client on separate domain. It will start separate http server to serve the application.
:::

Serve the application locally in development mode with hot-reload

```sh
pnpm dev
```

## Documentation

Documentation is built with [vitepress](https://vitepress.vuejs.org).

Serve the application locally in development mode with hot-reload

```sh
pnpm docs:dev
```

:::tip
Documentation is automatically rebuilt and deployed to dedicated site whenever source code is updated.
:::