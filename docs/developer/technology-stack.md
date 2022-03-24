# Technology Stack

## Frontend

There are two frontend apps:

- survey client
- admin client

Both built on same tech stack:

- [Vue](https://vuejs.org) The Progressive JavaScript Framework
- [Vue Router](https://router.vuejs.org) - The official router for Vue.js
- [Pinia](https://pinia.vuejs.org) - Global stores management
- [Vue I18n](http://kazupon.github.io/vue-i18n) - Internationalization
- [Vuetify](https://vuetifyjs.com) - Material design based UI component framework
- [Axios](https://github.com/axios/axios) - HTTP client

::: tip Vue version
Currently apps are built using Vue V2. Vue V3 is already released, but some of the 1st/3rd party plugins are still in process to be adopted for V3. Once Vue V3 plugins ecosystem catches up, we'll look into migration to V3.
:::

## Backend

- [Express](https://expressjs.com) - HTTP server
- [Sequelize](https://sequelize.org/master) - database ORM
- [Sequelize-typescript](https://github.com/RobinBuschmann/sequelize-typescript) - Decorators for Sequelize
- [Bullmq](https://docs.bullmq.io) - queue system built on top of Redis
