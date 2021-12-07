# Installation

This section briefly describes how to configure, compile and start the components of Intake24.

Source code also provides ansible roles for deployment to Ubuntu-based OS. [Deployment](/deployment/) section describes in detail how to use ansible scripts.

Clone the repository:

```sh
git clone https://github.com/MRC-Epid-it24/intake24
```

## Repository structure

Repository is set with [workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).

Shared components are in `packages` folder. Applications are in `apps` folder.

You can install all dependencies from root-level running
```sh
npm install
```

:::tip
Installing deps from top-level isn't 100% perfect. Few observations:
- it works fine for frontend apps
- `apps/api` can cause some platform-specific issues, where not all dependencies are correctly resolved. If you cannot boot it up due to missing dependencies, run `npm install` in `app/api` folder.
- some IDEs have issues to see all dependencies correctly and can show some false-positive issues of missing dependencies. This might require you to tweak your IDE to work correctly with multi-repository structure.
:::


If you are running `npm install` separately for each application, do not forget to run it in all `package/*` folders

Navigate to `packages/*` directory and install project dependencies.

```sh
cd packages/*

npm install
```

:::tip
Code is using `.env ` environment files. Each project contains a template file (`.env-template`). If you're setting up fresh project, you can run CLI command, which generates all the files and couple of required specific keys. Follow the [CLI instructions](/overview/cli/global) and how to run [generate-env](/overview/cli/generate-env).
:::

## API Server

Navigate to `apps/api` directory and install project dependencies.

```sh
cd apps/api

npm install
```

Copy template of configuration file and edit it as required. Please see [Configuration](/config/) section for detailed description of configuration options.

```sh
cp .env-template .env
```

Build the application

```
npm run prod
```

Start the application

```
npm run start
```

### For production, consider:

1) Deploy as dedicated service. Refer to your OS environment how to set that up.
2) User process manager, e.g. [PM2](https://pm2.keymetrics.io)
3) Deploy behind proper http server, e.g. [Nginx](https://www.nginx.com), [Apache](https://www.apache.org) etc.

Deployment section / ansible scripts provide examples how to use dedicated service on Ubuntu and run it behind Nginx reverse proxy.

## Admin client

Navigate to `apps/admin` directory and install project dependencies.

```sh
cd apps/admin

npm install
```

Copy template of configuration file and edit it as required. Please see [Configuration](/config/) section for detailed description of configuration options.

```sh
cp .env-template .env
```

Build the application

```
npm run build
```

Start the application

```
npm run start
```

:::tip
This should only be used if you host the client on separate domain. It will start separate http server to serve the application.
:::

## Survey client

Navigate to `apps/survey` directory and install project dependencies.

```sh
cd apps/survey

npm install
```

Copy template of configuration file and edit it as required. Please see [Configuration](/config/) section for detailed description of configuration options.

```sh
cp .env-template .env
```

Build the application

```
npm run build
```

Start the application

```
npm run start
```

:::tip
This should only be used if you host the client on separate domain. It will start separate http server to serve the application.
:::
