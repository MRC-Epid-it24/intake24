# Source code

Project is using `git` versioning system is hosted on [github](https://github.com/MRC-Epid-it24/intake24).

Clone the repository

```sh
git clone https://github.com/MRC-Epid-it24/intake24
```

## Repository structure

Repository is set as `mono-repository` with [workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).

Deployable applications are in `apps` folder. Shared components are in `packages` folder.

```
.
├─ .github -> Github actions / workflows
├─ apps -> Applications
│  ├─ api -> API Server
│  ├─ admin -> Admin tool
│  ├─ cli -> Command line interface
│  ├─ portal -> Portal website
│  └─ survey -> Survey application
├─ deployment - Ansible playbooks / scripts for deployment
├─ docker - Docker files for development
├─ docs -> Documentation
└─ packages
   ├─ api-client-v3 -> API Client (Intake24 V3)
   ├─ api-client-v4 -> API Client (Intake24 V4 - current)
   ├─ common -> repository-wide shared code
   ├─ common-backend -> backend shared code, e.g. services
   ├─ db -> database layer (models, migrations, etc.)
   ├─ i18n -> translation files for all applications
   └─ ui -> frontend shared code (admin / survey)
```

## Dependencies

Project is using [pnpm](https://pnpm.io) as a package manager.

Install `pnpm` using corepack or see [pnpm docs](https://pnpm.io) for further installation options.

```sh
corepack enable

corepack prepare pnpm@latest --activate
```

Install all dependencies from root-level

```sh
pnpm install
```

## Commit convention

Commit messages are restricted to follow `conventional-changelog` convention, adapted from [Angular's commit convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular).

Please see [`.github/commit-convention.md`](https://github.com/MRC-Epid-it24/intake24/blob/master/.github/commit-convention.md) for more details.

Please see [`scripts/verify-commit.ts`](https://github.com/MRC-Epid-it24/intake24/blob/master/scripts/verify-commit.ts) for implementation.

## Code style

Project is set up with [eslint](https://eslint.org/) and [prettier](https://prettier.io/) to help to keep clean and maintainable code.

Both integrate very well with most of the IDEs. Install respective plugins / extensions and configure it to run on `save` to have immediate effect.

You can also run lint process manually from root-level or in each `app` / `package`.

Run linting and try to fix as much as possible automatically

```sh
pnpm lint
```

Lint step also runs for each staged file, when changes are being committed (using git hooks).

## Renovate

Repository is set up with [renovate bot](https://github.com/renovatebot/renovate), which checks repository for up-to-date dependencies and prepares PRs to be merged. Renovate job runs on weekly basis and can be configured through [`.github/renovate.json5`](https://github.com/MRC-Epid-it24/intake24/blob/master/.github/renovate.json5) config file.

## Continuous integration

### Build

[Main CI](https://github.com/MRC-Epid-it24/intake24/blob/master/.github/workflows/ci.yml) action is triggered on any source code change and it runs lint / build / tests / steps for each of the components.

### Documentation

[Docs CI](https://github.com/MRC-Epid-it24/intake24/blob/master/.github/workflows/docs.yml) action is triggered on `docs` folder source code change and documentation site is automatically rebuilt and deployed to GitHub pages.
