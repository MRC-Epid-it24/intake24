# Personal access tokens

Personal access tokens allow to access intake24 API to perform actions on behalf of the user who issued the token.

::: danger
Personal access tokens are long-lived and meant to be used for `machine-to-machine` communication. Therefore personal access tokens should always be stored securely and not shared.
:::

Personal access tokens can be managed in `Account` -> `Personal access tokens` section.

## Issue personal access token

- `Name` - custom token name
- `Expires at` - token expiration date, default `1 year`, max `2 years`.

## Revoke personal access token

Personal access token can be revoked by clicking on the `Revoke` button.
