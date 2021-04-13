# Introduction

All parts of the system are using environment variables. Environment specific configuration is extracted to `process.env` variables. All applications are using [`dotenv`](https://github.com/motdotla/dotenv) and [`dotenv-expand`](https://github.com/motdotla/dotenv-expand) to set environment variables.

Application loads `.env` file in root directory. There is example file (`.env-template`), which can be used as template.

Copy the `.env-template` file and modify the `.env` file as needed.

```sh
cp .env-template .env
```

# API Server

Configuration files are stored in `src/config` directory.

Configuration is structured to following sections:

* [Application](/config/api-server/application.md)
* [Access Control List (ACL)](/config/api-server/acl.md)
* [Cache](/config/api-server/cache.md)
* [Database](/config/api-server/database.md)
* [Filesystem](/config/api-server/filesystem.md)
* [Mail](/config/api-server/mail.md)
* [Queue](/config/api-server/queue.md)
* [Security](/config/api-server/security.md)
* [Services](/config/api-server/services.md)

# Admin client

Admin client is [Vue.js](https://vuejs.org) based application and scaffolded with [vue-cli](https://cli.vuejs.org). Docs outline specific settings for deployment of the application. But feel free to dive in to [vue-cli](https://cli.vuejs.org) docs if any further modifications are required.

# Survey client

Survey client is [Vue.js](https://vuejs.org) based application and scaffolded with [vue-cli](https://cli.vuejs.org). Docs outline specific settings for deployment of the application. But feel free to dive in to [vue-cli](https://cli.vuejs.org) docs if any further modifications are required.
