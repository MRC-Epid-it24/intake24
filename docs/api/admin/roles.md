# Roles

## Browse roles

Browse paginated role list

### Request

```json
GET /api/admin/roles
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

## Create role

Create new role entry

### Request

```json
POST /api/admin/roles

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "name": string,
    "displayName": string,
    "description": string,
    "permissions": string[]
}
```

### Response

```json
201 Created

{
    ...
}
```

## Get role

Get role entry

### Request

```json
GET /api/admin/roles/:roleId

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

## Update role

Update role entry

### Request

```json
PUT /api/admin/roles/:roleId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "name": string,
    "displayName": string,
    "description": string,
    "permissions": string[]
}
```

### Response

```json
200 OK

{
    ...
}
```

## Delete role

Delete role entry

### Request

```json
DELETE /api/admin/roles/:roleId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```

## Role references

Get role references

### Request

```json
GET /api/admin/roles/refs

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
    ]
}
```

## Permissions associated with role

Get permissions associated with role

### Request

```json
GET /api/admin/roles/:roleId/permissions
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

## Users associated with role

Get users associated with role

### Request

```json
GET /api/admin/roles/:roleId/users
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
