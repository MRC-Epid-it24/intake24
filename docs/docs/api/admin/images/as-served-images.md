# As served images

## Browse as served images

Browse paginated as served image list

### Request

```http
GET /api/admin/images/as-served/:asServedSetId/images
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

## Create as served image

Create new as served image entry

### Request

```http
POST /api/admin/images/as-served/:asServedSetId/images

Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

{
    "image": File,
    "weight": number
}
```

### Response

```json
201 Created

{
    "data": {...}
}
```

## Get as served image

Get as served image entry

### Request

```http
GET /api/admin/images/as-served/:asServedSetId/images/:asServedImageId

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

## Delete as served image

Delete as served image entry

### Request

```http
DELETE /api/admin/images/as-served/:asServedSetId/images/:asServedImageId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```
