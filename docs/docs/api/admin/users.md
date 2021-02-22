# Users

## List users

Browse paginated user list

### Request

```http
GET /api/admin/users
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

## Create user

Create new user entry

### Request

```http
POST /api/admin/users

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "name": string,
    "email": string,
    "phone": string,
    "emailNotifications": boolean,
    "smsNotifications": boolean,
    "multiFactorAuthentication": boolean,
    "password": string,
    "passwordConfirm": string,
    "customFields": {
        "name": string,
        "value": string
    }[],
    "permissions": number[],
    "roles": number[]
}
```

### Response

```json
201 Created

{
    "data": {...}
}
```

## Get user

Get user entry

### Request

```http
GET /api/admin/users/:userId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "data": {...},
    "refs": {
        "permissions": [{...}],
        "roles": [{...}]
    }
}
```

## Update user

Update user entry

### Request

```http
PUT /api/admin/users/:userId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "name": string,
    "email": string,
    "phone": string,
    "emailNotifications": boolean,
    "smsNotifications": boolean,
    "multiFactorAuthentication": boolean,
    "customFields": { "name": string, "value": string }[],
    "permissions": number[],
    "roles": number[]
}
```

### Response

```json
200 OK

{
    "data": {...},
    "refs": {
        "permissions": [{...}],
        "roles": [{...}]
    }
}
```

## Delete user

Delete user entry

### Request

```http
DELETE /api/admin/users/:userId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```
