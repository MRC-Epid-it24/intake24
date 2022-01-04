# Requirements

* [Node.js](https://nodejs.org) runtime environment. System is tested with latest LTS (14.x | 16.x).

* [PNPM](https://pnpm.io) Alternative package manager with support for workspaces & mono-repository setup, which is encouraged to use for now.

* [NPM](https://docs.npmjs.com/cli) Although you can still use default `npm` shipped with `node.js`, there are few caveats with workspaces & mono-repository setup use. See [Installation section](/overview/installation/).

Intake24 system has three main components:

1) API server
2) Admin application
3) Survey application

Source code is written in Typescript and can be flexibly deployed to various environments. Source code also provides ansible roles for deployment to Ubuntu-based OS. [Deployment](/deployment/) section describes in detail how to use ansible scripts. For custom deployment, there are few requirements to consider.

### API Server

* Backend database engine. API server is using [sequelize](https://sequelize.org/master) ORM so any of supported dialects can be used.

::: tip
Older version (v3) has been written only for Postgres and there are still few Postgres specifics that needs to be ported to dialect-agnostic code. Please contact Intake24 dev team for more details about current state of DB engines support.
:::

* [Redis](https://redis.io) is used for caching and queueing system.

### Admin & Survey applications

Both Admin and Survey frontend applications are SPA (Single page application) written in Vue.js framework.

They can be deployed to:
1) Same domain site as API Server - if relative path is configured, API server automatically registers the routes to serve the application. Please see [Configuration](/config/) section for more details.
2) Different domain sites, CORS needs to be configured properly. There are simple http server scripts to serve the applications.
3) You can use any type of 3rd party provider like e.g. AWS S3, Heroku, Netlify etc.

:::tip
Please see [Vue CLI](https://cli.vuejs.org/guide/deployment.html#general-guidelines) docs for more details how to deploy Vue.js applications.
:::
