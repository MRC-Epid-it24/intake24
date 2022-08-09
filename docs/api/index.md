# Introduction

REST-based API endpoints use:

- mostly `application/json` content-type
- file-based endpoints use `multipart/form-data` content type

# Usage

Protected endpoints require to supply access token (obtained during login) in `Authorization` http header.

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
