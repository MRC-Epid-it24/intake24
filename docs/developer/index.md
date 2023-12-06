# Introduction

## Node.js

Install [Node.js](https://nodejs.org), ideally latest LTS.

Source code is written in Typescript. Backend apps (`API server` / `CLI` / `Portal`) are using `Node.js`. Frontend apps (`Admin tool` and `Survey application`) are built using `Vue.js` framework.

## Package manager

Node.js ecosystem has couple of package managers.

Node.js ships with `npm` as default package manager. However, it does have some drawbacks like dependencies install / tree resolve time, support for monorepos etc.

Intake24 is set up with `pnpm` as it provides better install speeds / monorepo setup support etc.

Install `pnpm` using corepack or see [pnpm docs](https://pnpm.io) for further installation options.

```sh
corepack enable

corepack prepare pnpm@latest --activate
```
