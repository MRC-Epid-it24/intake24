# Requirements

- [Node.js](https://nodejs.org) runtime environment. System is tested with latest LTS releases.

- [PNPM](https://pnpm.io) package manager.

Intake24 system has three main components:

1. API server
2. Admin application
3. Survey application

Source code is written in Typescript and can be flexibly deployed to various environments. Source code also provides ansible roles for deployment to Ubuntu-based OS. [Deployment](/deployment/) section describes in detail how to use ansible scripts.

For manual deployment, there are few technical aspects to consider.

## API Server

### Databases

- [sequelize](https://sequelize.org) ORM is used for database querying, any of supported dialects can be used.

::: warning
Older version (v3) has been written only for Postgres and there are still few Postgres specifics that needs to be ported to dialect-agnostic code. Please contact Intake24 dev team for more details about current state of DB engines support.
:::

### Redis

- [Redis](https://redis.io) is used for `cache` / `queue` / `rate-limit` / `session` services.

### PDF generation

- [Puppeteer](https://github.com/puppeteer/puppeteer) is used for PDF generation. Make sure OS has all necessary components to run headless Chrome.

## Admin & Survey apps

Both Admin and Survey frontend applications are SPA (Single page application) written in [Vue.js](https://vuejs.org) framework and built with [Vite](https://vitejs.dev).

Both applications have identical build toolchain pipeline and can be deployed to:

1. Same domain site as API Server - if relative path is configured, API server automatically registers the routes to serve the application within its context. Please see [Configuration](/config/) section for more details.
2. Applications can be served directly by web server (Nginx, Apache). Or there are simple http server scripts to serve the applications. For different domain sites, CORS needs to be configured properly.
3. 3rd party providers like e.g. AWS S3, Heroku, Netlify etc.

:::tip
Please see [Vite](https://vitejs.dev) docs for more details how to deploy Vue.js applications.
:::
