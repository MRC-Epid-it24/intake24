# Get started

This section briefly describes how to configure, build and start the Intake24 components.

## Repository

Clone the repository
```sh
git clone https://github.com/MRC-Epid-it24/intake24
```

Repository is set as mono-repository with [workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).

Shared components are in `packages` folder. Applications are in `apps` folder.

Install `pnpm` using built-in `npm` or see [pnpm docs](https://pnpm.io) for further options.
```sh
npm install -g pnpm
```

You can then install all dependencies from root-level running
```sh
pnpm install
```

:::warning
Installing deps from top-level using `npm` isn't 100% perfect. Few observations:
- it works fine for frontend apps
- `apps/api` can cause some platform-specific issues, where not all dependencies are correctly resolved. If you cannot boot it up due to missing dependencies, run `npm install` in `app/api` folder.
- above applies also for few packages
- some IDEs have issues to see all dependencies correctly and can show some false-positive issues of missing dependencies. This might require you to tweak your IDE to work correctly with multi-repository structure.
:::

If you are running `npm install` separately for each application, do not forget to run it in all `package/*` folders

Navigate to `packages/*` directory and install project dependencies.



:::tip
Code is using `.env ` environment files. Each project contains a template file (`.env-template`). If you're setting up fresh project, you can run CLI command, which generates all the files and couple of required specific keys. Follow the [CLI instructions](/overview/cli/global) and how to run [generate-env](/overview/cli/generate-env).
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
pnpm run dev
```

:::tip
Documentation is automatically rebuild and deployed to dedicated site whenever source code is updated.
:::