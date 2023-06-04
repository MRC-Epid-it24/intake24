# Permissions

## Browse permissions

Browse paginated permission list

### Request

```json
GET /api/admin/permissions
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

## Create permission

Create new permission entry

### Request

```json
POST /api/admin/permissions

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "name": string,
    "displayName": string,
    "description": string
}
```

### Response

```json
201 Created

{
    ...
}
```

## Get permission

Get permission entry

### Request

```json
GET /api/admin/permissions/:permissionId

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

## Update permission

Update permission entry

### Request

```json
PUT /api/admin/permissions/:permissionId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "name": string,
    "displayName": string,
    "description": string
}
```

### Response

```json
200 OK

{
    ...
}
```

## Delete permission

Delete permission entry

### Request

```json
DELETE /api/admin/permissions/:permissionId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```

## Permission roles

Get roles associated with permission

### Request

```json
GET /api/admin/permissions/:permissionId/roles
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

## Permission users

Get users associated with permission

### Request

```json
GET /api/admin/permissions/:permissionId/users
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
