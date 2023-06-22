# Guide images

## Browse guide images

Browse paginated guide image list

### Request

```json
GET /api/admin/images/guide-images
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
            "description": string,
            "imageUrl": string,
        },
        ...
    ],
    "meta": {...}
}
```

## Create guide image

Create new guide image entry

### Request

```json
POST /api/admin/images/guide-images

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
    "id": string,
    "description": string,
    "baseImageUrl": string,
    "imageMapId": string,
    "objects": [
        {
            "id": string,
            "description": string,
            "label": { "en": string, ... },
            "outlineCoordinates": number[],
            "weight": number
        },
        ...
    ],
}
```

## Get guide image

Get guide image entry

### Request

```json
GET /api/admin/images/guide-images/:guideImageId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "id": string,
    "description": string,
    "baseImageUrl": string,
    "imageMapId": string,
    "objects": [
        {
            "id": string,
            "description": string,
            "label": { "en": string, ... },
            "outlineCoordinates": number[],
            "weight": number
        },
        ...
    ],
}
```

## Update guide image

Update guide image entry

### Request

```json
PUT /api/admin/images/guide-images/:guideImageId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "description": string,
    "objects": [
        {
            "id": number,
            "label": { "en": string, ... },
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
    "id": string,
    "description": string,
    "baseImageUrl": string,
    "imageMapId": string,
    "objects": [
        {
            "id": string,
            "description": string,
            "label": { "en": string, ... },
            "outlineCoordinates": number[],
            "weight": number
        },
        ...
    ],
}
```

## Delete guide image

Delete guide image entry

### Request

```json
DELETE /api/admin/images/guide-images/:guideImageId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```

## Guide image references

Get guide image references

### Request

```json
GET /api/admin/images/guide-images/refs

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "imageMaps": [
        {
            "id": string,
            "description": string
        },
        ...
    ]
}
```
