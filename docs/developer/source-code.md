# Source code

Install `git` if you don't already have it.

## Repository

Clone the repository
```sh
git clone https://github.com/MRC-Epid-it24/intake24
```

Repository is set as mono-repository with [workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).

Applications are in `apps` folder. Shared components are in `packages` folder.

```
├─ apps -> Applications
│  └─ api -> API Server
│  └─ admin -> Admin tool
│  └─ cli -> Command line interface
│  └─ docs -> Documentation site
│  └─ survey -> Survey applications
├─ deployment - Ansible playbooks / scripts for deployment
└─ packages
   └─ common (common shared code)
   └─ db (database layer)
   └─ i18n (translations)
   └─ services (shared services for apps)
   └─ ui (shared UI components for frontend apps)
```

## Dependencies

Intake24 components are set up with `pnpm` and documentation is set up with `npm` (there are some issues to be resolved for migration to `pnpm`).

Install `pnpm` using built-in `npm` or see [pnpm docs](https://pnpm.io) for further options.
```sh
npm install -g pnpm
```

Install all dependencies from root-level
```sh
pnpm install
```

:::warning
Installing deps from top-level using `npm` isn't 100% perfect. Few observations:
- it works fine for frontend apps
- `apps/api` can cause some platform-specific issues, where not all dependencies are correctly resolved. If you cannot boot it up due to missing dependencies, run `npm install` in `app/api` folder.
- above applies also for few packages
- some IDEs have issues to see all dependencies correctly and can show some false-positive issues of missing dependencies. This might require you to tweak your IDE to work correctly with multi-repository structure.
:::

If you are running `npm install` separately for each application, do not forget to run it in all `package/*` folders

## Code style

Project is set up with [eslint](https://eslint.org/) and [prettier](https://prettier.io/) to help to keep clean and maintainable code.

Both integrate very well with most of the IDEs. You will probably just need to install respective plugins / extensions and configure it to run on `save` to have immediate effect.

You can also run it manually from root-level or in each `app` / `package`.

Run linting
```
pnpm lint
```

Run linting and try to fix as much as possible automatically
```
pnpm lint:fix
```

## Renovate

Repository is set up with [renovate bot](https://github.com/renovatebot/renovate), which checks the dependecies prepare PRs. It runs on weekly basis and can be configured using [`renovate.json`](https://github.com/MRC-Epid-it24/intake24/blob/master/.github/renovate.json5) config file.

## Continuous integration

### Build

Main [Build CI](https://github.com/MRC-Epid-it24/intake24/blob/master/.github/workflows/ci.yml) action is triggered on source code change and it runs build / tests / lint steps for each components to ensure all is working as expected.

### Documentation

Whenever `docs` source code is modified, [Docs CI](https://github.com/MRC-Epid-it24/intake24/blob/master/.github/workflows/docs.yml) is triggered and documentation site is automatically rebuilt.