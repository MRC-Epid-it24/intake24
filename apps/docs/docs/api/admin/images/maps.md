# Image maps

## Browse image maps

Browse paginated image map list

### Request

```http
GET /api/admin/images/maps
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

## Create image map

Create new image map entry

### Request

```http
POST /api/admin/images/maps

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
    "data": {...}
}
```

## Get image map

Get image map entry

### Request

```http
GET /api/admin/images/maps/:imageMapId

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

## Update image map

Update image map entry

### Request

```http
PUT /api/admin/images/maps/:imageMapId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "description": string,
    "objects": [
        {
            "id": number,
            "description": string,
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
    "data": {...},
    "refs": {...}
}
```

## Delete image map

Delete image map entry

### Request

```http
DELETE /api/admin/images/maps/:imageMapId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```
