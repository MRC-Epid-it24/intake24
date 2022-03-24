# Introduction

All parts of the system are using environment variables. Environment specific configuration is parsed to `process.env` variables. All applications are using [`dotenv`](https://github.com/motdotla/dotenv) and [`dotenv-expand`](https://github.com/motdotla/dotenv-expand) to set environment variables.

Each `application` / `package` loads `.env` file in respective directory. There is example file (`.env-template`), which can be used as template.

Copy the `.env-template` file and modify the `.env` file as needed.

```sh
cp .env-template .env
```

# API Server

Configuration files are stored in `src/config` directory of `application` or `package`.

Configuration is structured to following sections:

- [Application](/config/api/application)
- [Access Control List (ACL)](/config/api/acl)
- [Cache](/config/api/cache)
- [Database](/config/api/database)
- [Filesystem](/config/api/filesystem)
- [Mail](/config/api/mail)
- [Logging](/config/api/log)
- [Queue](/config/api/queue)
- [Security](/config/api/security)
- [Services](/config/api/services)
- [Session](/config/api/session)

# Admin client

Admin client is [Vue.js](https://vuejs.org) based application and scaffolded with [vue-cli](https://cli.vuejs.org). Docs outline specific settings for deployment of the application. But feel free to dive in to [vue-cli](https://cli.vuejs.org) docs if any further modifications are required.

# Survey client

Survey client is [Vue.js](https://vuejs.org) based application and scaffolded with [vue-cli](https://cli.vuejs.org). Docs outline specific settings for deployment of the application. But feel free to dive in to [vue-cli](https://cli.vuejs.org) docs if any further modifications are required.
