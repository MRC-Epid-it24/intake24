# As served images

## Browse as served images

Browse paginated as served image list

### Request

```http
GET /api/admin/images/as-served-sets/:asServedSetId/images
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
    "data": [
        {
            "id": string,
            "weight": number,
            "mainImageUrl": string,
            "thumbnailUrl": string,
        },
        ...
    ],
    "meta": {...}
}
```

## Create as served image

Create new as served image entry

### Request

```http
POST /api/admin/images/as-served-sets/:asServedSetId/images

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
    "id": string,
    "weight": number,
    "mainImageUrl": string,
    "thumbnailUrl": string,
}
```

## Get as served image

Get as served image entry

### Request

```http
GET /api/admin/images/as-served-sets/:asServedSetId/images/:asServedImageId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "id": string,
    "weight": number,
    "mainImageUrl": string,
    "thumbnailUrl": string,
}
```

## Delete as served image

Delete as served image entry

### Request

```http
DELETE /api/admin/images/as-served-sets/:asServedSetId/images/:asServedImageId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```
