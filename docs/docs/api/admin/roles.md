# Roles

## List roles

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
    "permissions": number[]
}
```

### Response

```json
201 Created

{
    "data": {...}
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
    "data": {...},
    "refs": {
        "permissions": [{...}]
    }
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
    "permissions": number[]
}
```

### Response

```json
200 OK

{
    "data": {...},
    "refs": {
        "permissions": [{...}]
    }
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
