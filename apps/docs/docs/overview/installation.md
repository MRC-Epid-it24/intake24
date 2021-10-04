# Installation

This section briefly describes how to configure, compile and start the components of Intake24.

Source code also provides ansible roles for deployment to Ubuntu-based OS. [Deployment](/deployment/) section describes in detail how to use ansible scripts.

Clone the repository:

```sh
git clone https://github.com/MRC-Epid-it24/intake24
```

System components share some code which is in `common` directory.

Navigate to `common` directory and install project dependencies.

```sh
cd common

npm install
```

## API Server

Navigate to `api` directory and install project dependencies.

```sh
cd api

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

Navigate to `admin` directory and install project dependencies.

```sh
cd admin

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

Navigate to `survey` directory and install project dependencies.

```sh
cd survey

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
