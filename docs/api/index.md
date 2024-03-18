# Introduction

REST-based API endpoints use:

- `application/json` content-type
- `multipart/form-data` content type with `file` payloads

## Reference

OpenAPI specification is used to describe the API -> [OpenAPI specification](/open-api.html){target="blank"}

::: warning
OpenAPI specification is only available for survey endpoints. Admin endpoints are not yet documented.

We're in the process of adding OpenAPI specification for all endpoints.
:::

## Authentication

Authorization-protected endpoints require to supply access token (JSON Web Token, a.k.a `JWT`) (obtained during login) in `Authorization` http header.

#### Request

```http
GET /api/endpoint

Authorization: Bearer {accessToken}
Content-Type: application/json
```

#### Response

```json
200 OK

{
    ...
}
```

### SPA applications

Authentication system for SPA applications is based on combination of short-lived `access token` and long-lived `refresh token`.

Login endpoints issue JWT `access tokens` in response body. `Access token` is short-lived JWT and has to be included in `Authorization` header for specific endpoint.

```http
GET /some/end/point

Authorization: Bearer {accessToken}
Content-Type: application/json
```

Response includes cookie with `refresh token`, which can be used to obtain fresh `access token`. By default, cookie is `http-only` (prevents to be read by javascript code) and `secure` (sent over https-only), please refer to [security configuration](/config/api/security#json-web-tokens) for more details.

Combination of short-lived `access token` and long-lived `refresh token` is focused on security and usability within SPA applications. Moreover, account can be protected with multi-factor authentication, which is not suitable for `machine-to-machine` communication.

### M2M communication

The use of `personal access tokens` is recommended for `machine-to-machine` communication.

Personal access tokens are long-lived JWT tokens, which can be used to authenticate requests. Personal access tokens are bound to specific user. Personal access tokens can be managed in [admin tool](/admin/user/personal-access-tokens).

::: tip
Personal access tokens are long lived and should be treated as sensitive data. They has to be stored securely and should never be exposed to public (e.g. embedded into frontend code).
:::
