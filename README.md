# Intake24-api-ng

Intake24 API Server

## 1. Installation

Install local project dependencies

```sh
npm install
```

Copy `.env-template` to `.env` file

```sh
cp .env-template .env
```

Edit `.env` file and set up main configuration variables

Any additional configuration variables (not extracted as ENV variables) can be found in `src/config` folder.

## 2. Build

### 2.1. Development environment

Start a server with hot-reloading

```sh
npm run dev
```

### 2.2. Production environment

Build node.js application

```sh
npm run prod
```

Launch node.js application

```sh
npm run serve
```

Optional

- install as service
- use node.js process manager like `pm2`
