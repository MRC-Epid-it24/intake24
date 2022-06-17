# Requirements

- [Node.js](https://nodejs.org) runtime environment. System is tested with latest LTS (14.x | 16.x).

- [PNPM](https://pnpm.io) Package manager with support for workspaces & mono-repository setup.

Intake24 system has three main components:

1. API server
2. Admin application
3. Survey application

Source code is written in Typescript and can be flexibly deployed to various environments. Source code also provides ansible roles for deployment to Ubuntu-based OS. [Deployment](/deployment/) section describes in detail how to use ansible scripts. For custom deployment, there are few requirements to consider.

## API Server

- Backend database engine. API server is using [sequelize](https://sequelize.org) ORM so any of supported dialects can be used.

::: tip
Older version (v3) has been written only for Postgres and there are still few Postgres specifics that needs to be ported to dialect-agnostic code. Please contact Intake24 dev team for more details about current state of DB engines support.
:::

- [Redis](https://redis.io) is used for `cache` / `queue` / `rate-limit` / `session` services.

- [Puppeteer](https://github.com/puppeteer/puppeteer) is used for PDF generation. Make sure OS has all necessary components to run headless Chrome.

## Admin & Survey apps

Both Admin and Survey frontend applications are SPA (Single page application) written in Vue.js framework and [Vite](https://vitejs.dev) is used as build tool.

They can be deployed to:

1. Same domain site as API Server - if relative path is configured, API server automatically registers the routes to serve the application. Please see [Configuration](/config/) section for more details.
2. Different domain sites, CORS needs to be configured properly. There are simple http server scripts to serve the applications.
3. You can use any type of 3rd party provider like e.g. AWS S3, Heroku, Netlify etc.

:::tip
Please see [Vite](https://vitejs.dev) docs for more details how to deploy Vue.js applications.
:::
