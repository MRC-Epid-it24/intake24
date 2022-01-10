# Testing

Both `admin` / `survey` front-ends and `api` backend are set up with [Jest](https://jestjs.io) testing framework.

## API Server

To run unit and integration tests on your local machine, start by copying your `.env` file to `__tests__/.env-test`.

Make sure to edit the `.env-test` file and change the database settings to point to test databases instead of your
normal development ones. The foods and system test databases should be empty databases with the necessary 
extensions (e.g., `uuid-ossp`) installed. 

:::danger
**Do not run any tests** unless you're sure that the database configuration settings in the `.env-test` file are 
correct because the test framework setup code will **destroy all data** in those databases!    
:::

If using the development VM, simply copy `__tests__/.env-test-dev-vm` to `__tests__/.env-test` and you're good to go.

Backend testing is set up for `unit` and `integration` tests. You can run tests with following commands.

Unit tests
```sh
pnpm run test:unit
```

Unit tests watch for development
```sh
pnpm run test:unit:watch
```

Integration tests
```sh
pnpm run test:integration
```

Integration tests watch for development

```sh
pnpm run test:integration:watch
```

## Admin & Survey apps

Frontends use Vue.js Jest implementation, so you can run tests with:

```sh
pnpm run test
```
