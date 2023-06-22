# Image maps

## Browse image maps

Browse paginated image map list

### Request

```json
GET /api/admin/images/image-maps
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

## Create image map

Create new image map entry

### Request

```json
POST /api/admin/images/image-maps

Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

{
    "id": string,
    "description": string,
    "baseImage": File
}
```

### Response

```json
201 Created

{
    "id": string,
    "description": string,
    "baseImageUrl": string,
    "objects": [
        {
            "id": string,
            "description": string,
            "label": { "en": string, ... },
            "outlineCoordinates": number[]
        },
        ...
    ],
}
```

## Get image map

Get image map entry

### Request

```json
GET /api/admin/images/image-maps/:imageMapId

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
    "objects": [
        {
            "id": string,
            "description": string,
            "label": { "en": string, ... },
            "outlineCoordinates": number[]
        },
        ...
    ],
}
```

## Update image map

Update image map entry

### Request

```json
PUT /api/admin/images/image-maps/:imageMapId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "description": string,
    "objects": [
        {
            "id": number,
            "description": string,
            "label": { "en": string, ... },
            "outlineCoordinates": number[]
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
    "objects": [
        {
            "id": string,
            "description": string,
            "label": { "en": string, ... },
            "outlineCoordinates": number[]
        },
        ...
    ],
}
```

## Delete image map

Delete image map entry

### Request

```json
DELETE /api/admin/images/image-maps/:imageMapId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```
