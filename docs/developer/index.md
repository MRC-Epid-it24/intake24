# Introduction

## Node.js

Install [Node.js](https://nodejs.org), ideally latest LTS (v16).

Source code is written in Typescript. Backend apps (`API server` and `CLI`) are using `Node.js`. Frontend apps (`Admin tool` and `Survey application`) are built using `Vue.js` framework.

## Package managers

Node.js ecosystem has couple of package managers.

Node.js shipps with `npm` as default package manager. However, it does have some drawbacks like dependencies install / tree resolve time, support for monorepos etc.

There are two 3rd party ones, `yarn` (facebook backed) and `pnpm` (community backed), both with great support support and comes with better speeds / features like monorepos.

Node.js v16.9 comes with `corepack`, which is sort of a bridge between managers and can be used to install other managers. Though, you can install them usually just through `npm` like any other package.

Intake24 is now set with `pnpm` as it provides better install speeds / monorepo setup support etc,

Install `pnpm` using built-in `npm` or see [pnpm docs](https://pnpm.io) for further options.

```sh
npm install -g pnpm
```
