# Introduction

All parts of the system are using environment variables. Environment specific configuration is parsed to `process.env` variables. All applications are using [`dotenv`](https://github.com/motdotla/dotenv) and [`dotenv-expand`](https://github.com/motdotla/dotenv-expand) to set environment variables.

Each `application` / `package` loads `.env` file in respective directory. There is an example file (`.env-template`) in each relevant directory, which can be used as template.

## Clone `.env-template`

Copy the `.env-template` file in respective folder and modify the `.env` file as needed.

```sh
cp .env-template .env
```

## Generate .env file by CLI

Instead of copy and rename `.env-template` file, you can also use the [CLI](../../cli/generate-env) to generate a `.env` file.
