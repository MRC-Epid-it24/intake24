# Introduction

Command line interface to run specific scripts / tasks is implemented as standalone app `apps/cli`.


## Installation

Navigate to application folder

```sh
cd apps/cli
```

Install local project dependencies

```sh
npm install
```

Build the project for production

```sh
npm run prod
```

or for development (with file watching and reloads)

```sh
npm run dev
```

## Usage

You can run commands either on top/root level repository or within `apps/cli`.

```sh
npm run cli -- <command> <options>
```

:::warning
Please note the syntax and double-dash. Double-dash will pass the arguments to the script. If omitted `npm` would try to interpret them as well.
:::
