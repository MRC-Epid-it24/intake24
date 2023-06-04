# Users

## Browse users

Browse paginated user list

### Request

```json
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

```json
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
    "customFields": [
        {
            "name": string,
            "value": string
        },
        ...
    ],
    "permissions": string[],
    "roles": string[]
}
```

### Response

```json
201 Created

{
    ...
}
```

## Get user

Get user entry

### Request

```json
GET /api/admin/users/:userId

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

## Update user

Update user entry

### Request

```json
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
    "customFields": [
        {
            "name": string,
            "value": string
        }
    ],
    "permissions": string[],
    "roles": string[]
}
```

### Response

```json
200 OK

{
    ...
}
```

## Delete user

Delete user entry

### Request

```json
DELETE /api/admin/users/:userId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```

## User references

Get user references

### Request

```json
GET /api/admin/users/refs

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "permissions": [
        {
            "id": string,
            "name": string,
            "displayName": string
        },
        ...
    ],
    "roles": [
        {
            "id": string,
            "name": string,
            "displayName": string
        },
        ...
    ]
}
```

## User permissions

Get permissions associated with user

### Request

```json
GET /api/admin/users/:userId/permissions
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

## User roles

Get roles associated with user

### Request

```json
GET /api/admin/users/:userId/roles
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
