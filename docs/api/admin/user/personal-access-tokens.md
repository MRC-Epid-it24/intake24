# Personal access tokens

Personal access tokens are JWT tokens and allow to access intake24 API and perform actions on behalf of the user.

## Browse personal access tokens

Browse paginated personal access tokens list

### Request

```http
GET /api/admin/user/personal-access-tokens
    ?search={searchText}
    &page={page}
    &limit={limit}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "data": [{...}],
    "meta": {...}
}
```

## Issue personal access token

Issue new personal access token

### Request

```http
POST /api/admin/user/personal-access-tokens

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "name": string,
    "expiresAt": string
}
```

### Response

```json
201 Created

{
    "jwt": string,
    "token": { ... }
}
```

## Revoke personal access token

Revoke personal access token

### Request

```http
DELETE /api/admin/user/personal-access-tokens/:tokenId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```
