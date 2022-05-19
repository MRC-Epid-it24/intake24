# Roles

## Browse roles

Browse paginated role list

### Request

```http
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

```http
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

```http
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

```http
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

```http
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

```http
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
