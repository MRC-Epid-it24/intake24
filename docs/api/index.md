# Introduction

REST-based API endpoints use:

- `application/json` content-type
- `multipart/form-data` content type with file payloads

## Reference

OpenAPI specification is used to describe the API -> [OpenAPI specification](/open-api.html){target="blank"}

::: warning
OpenAPI specification is only available for survey endpoints. Admin endpoints are not yet documented.

We're in the process of adding OpenAPI specification for all endpoints.
:::

## Usage

Authorization-protected endpoints require to supply access token (JSON Web Token, a.k.a `JWT`) (obtained during login) in `Authorization` http header.

## Header format

```
Authorization: Bearer {accessToken}
```

## Example request

### Request

```json
GET /api/endpoint

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    ...
}
```
