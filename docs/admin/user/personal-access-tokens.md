# Personal access tokens

Personal access tokens are JWT tokens and allow to access intake24 API and perform actions on behalf of the user who issued the token.

::: warning
Personal access tokens can be long-lived and are meant to be used for `machine-to-machine` communication. Thus should be stored securely and not shared.
:::

List of personal access tokens can be found in `Account` -> `Personal access tokens` menu.

## Issue personal access token

- `Name` - custom token name
- `Expires at` - token expiration date, default `1 yea`r, max `2 years`.

## Revoke personal access token

Personal access token can be revoked by clicking on the `Revoke` button.
