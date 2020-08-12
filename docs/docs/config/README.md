# Introduction

Configuration files are stored in `src/config` directory.

To ease the deployment, environment specific configuration are extracted to `process.env` variables. All applications are using [`dotenv`](https://github.com/motdotla/dotenv) and [`dotenv`](https://github.com/motdotla/dotenv-expand) to set environment variables.

Application loads `.env` file in root directory. There is example file (`.env-template`), which can be used as template.

Copy the `.env-template` file and modify the `.env` file as needed.

```sh
cp .env-template .env
```
