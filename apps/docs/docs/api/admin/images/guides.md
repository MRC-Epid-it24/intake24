# Guide image

## Browse guide images

Browse paginated guide image list

### Request

```http
GET /api/admin/images/guides
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

## Create guide image

Create new guide image entry

### Request

```http
POST /api/admin/images/guides

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "id": string,
    "imageMapId": string,
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

## Get guide image

Get guide image entry

### Request

```http
GET /api/admin/images/guides/:guideImageId

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

## Update guide image

Update guide image entry

### Request

```http
PUT /api/admin/images/guides/:guideImageId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "description": string,
    "objects": [
        {
            "id": number,
            "weight": number
        },
        ...
    ]
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

## Delete guide image

Delete guide image entry

### Request

```http
DELETE /api/admin/images/guides/:guideImageId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```
