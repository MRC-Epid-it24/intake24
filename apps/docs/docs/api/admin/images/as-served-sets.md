# As served sets

## Browse as served sets

Browse paginated as served set list

### Request

```http
GET /api/admin/images/as-served
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

## Create as served set

Create new as served set entry

### Request

```http
POST /api/admin/images/as-served

Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

{
    "id": string,
    "description": string,
    "selectionImage": File
}
```

### Response

```json
201 Created

{
    "data": {...}
}
```

## Get as served set

Get as served set entry

### Request

```http
GET /api/admin/images/as-served/:asServedSetId

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

## Update as served set

Update as served set entry

### Request

```http
PUT /api/admin/images/as-served/:asServedSetId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "description": string,
    "images": [
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

## Delete as served set

Delete as served set entry

### Request

```http
DELETE /api/admin/images/as-served/:asServedSetId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```
