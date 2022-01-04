# Repository

Clone the repository
```sh
git clone https://github.com/MRC-Epid-it24/intake24
```

Repository is set as mono-repository with [workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).

Shared components are in `packages` folder. Applications are in `apps` folder.

There are some caveats with using `npm` and workspaces & monorepo implementation. So `pnpm` is now recommended to use.

Install `pnpm` using built-in `npm` or see [pnpm docs](https://pnpm.io) for further options.
```sh
npm install -g pnpm
```

You can then install all dependencies from root-level running
```sh
pnpm install
```

:::tip
Installing deps from top-level using `npm` isn't 100% perfect. Few observations:
- it works fine for frontend apps
- `apps/api` can cause some platform-specific issues, where not all dependencies are correctly resolved. If you cannot boot it up due to missing dependencies, run `npm install` in `app/api` folder.
- above applies also for few packages
- some IDEs have issues to see all dependencies correctly and can show some false-positive issues of missing dependencies. This might require you to tweak your IDE to work correctly with multi-repository structure.
:::

If you are running `npm install` separately for each application, do not forget to run it in all `package/*` folders

Navigate to `packages/*` directory and install project dependencies.

```sh
cd packages/*

npm install
```

:::tip
Code is using `.env ` environment files. Each project contains a template file (`.env-template`). If you're setting up fresh project, you can run CLI command, which generates all the files and couple of required specific keys. Follow the [CLI instructions](/overview/cli/global) and how to run [generate-env](/overview/cli/generate-env).
:::
