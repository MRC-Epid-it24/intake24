# Permissions

## List permissions

Get permission list

### Request

```http
GET /admin/permissions
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

```http
POST /admin/permissions

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
    "data": {...}
}
```

## Get permission

Get permission entry

### Request

```http
GET /admin/permissions/:permissionId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "data": {...},
    "refs": {...}
}
```

## Update permission

Update permission entry

### Request

```http
PUT /admin/permissions/:permissionId

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
    "data": {...},
    "refs": {...}
}
```

## Delete permission

Delete permission entry

### Request

```http
DELETE /admin/permissions/:permissionId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```
