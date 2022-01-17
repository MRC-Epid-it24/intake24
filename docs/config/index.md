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

* [Application](/config/api/application.md)
* [Access Control List (ACL)](/config/api/acl.md)
* [Cache](/config/api/cache.md)
* [Database](/config/api/database.md)
* [Filesystem](/config/api/filesystem.md)
* [Mail](/config/api/mail.md)
* [Queue](/config/api/queue.md)
* [Security](/config/api/security.md)
* [Services](/config/api/services.md)

# Admin client

Admin client is [Vue.js](https://vuejs.org) based application and scaffolded with [vue-cli](https://cli.vuejs.org). Docs outline specific settings for deployment of the application. But feel free to dive in to [vue-cli](https://cli.vuejs.org) docs if any further modifications are required.

# Survey client

Survey client is [Vue.js](https://vuejs.org) based application and scaffolded with [vue-cli](https://cli.vuejs.org). Docs outline specific settings for deployment of the application. But feel free to dive in to [vue-cli](https://cli.vuejs.org) docs if any further modifications are required.
