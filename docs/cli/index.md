# Introduction

Command line interface to run specific scripts / tasks. It is implemented as standalone app `apps/cli`.

## Installation

Navigate to application folder

```sh
cd apps/cli
```

Build the project for production

```sh
pnpm build
```

Run CLI

```sh
pnpm cli
```

:::tip
CLI can also be executed from top-level running `pnpm cli`
:::

Run CLI in development mode

Run through `ts-node`.

```sh
pnpm cli:dev
```

For development (with file watching and reloads)

```sh
pnpm dev
```

## Usage

You can run commands either on top/root level repository or within `apps/cli`.

```sh
pnpm cli -- <command> <options>
```

:::warning
Please note the syntax and double-dash. Double-dash will pass the arguments to the script. If omitted `pnpm` would try to interpret them as well.
:::
