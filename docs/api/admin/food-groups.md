# Food groups

## Browse food groups

Browse paginated food groups list

### Request

```http
GET /api/admin/food-groups
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

## Create food group

Create new food group entry

### Request

```http
POST /api/admin/food-groups

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "name": string
}
```

### Response

```json
201 Created

{
    "id": string,
    "name": string
}
```

## Get food group

Get food group entry

### Request

```http
GET /api/admin/food-groups/:foodGroupId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "id": string,
    "name": string
}
```

## Update food group

Update food group entry

### Request

```http
PUT /api/admin/food-groups/:foodGroupId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "name": string,
}
```

### Response

```json
200 OK

{
    "id": string,
    "name": string
}
```

## Delete food group

Delete food group entry

### Request

```http
DELETE /api/admin/food-groups/:foodGroupId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```
