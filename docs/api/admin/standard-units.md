# Standard units

## Browse standard units

Browse paginated standard standard list

### Request

```http
GET /api/admin/standard-units
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

## Create standard unit

Create new standard unit entry

### Request

```http
POST /api/admin/standard-units

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "id": string,
    "estimateIn": { "en": string, ... },
    "howMany": { "en": string, ... }
}
```

### Response

```json
201 Created

{
    ...
}
```

## Get standard unit

Get standard unit entry

### Request

```http
GET /api/admin/standard-units/:standardUnitId

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

## Update standard unit

Update standard unit entry

### Request

```http
PUT /api/admin/standard-units/:standardUnitId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "estimateIn": { "en": string, ... },
    "howMany": { "en": string, ... }
}
```

### Response

```json
200 OK

{
    ...
}
```

## Delete standard unit

Delete standard unit entry

### Request

```http
DELETE /api/admin/standard-units/:standardUnitId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```

## Get standard unit categories

Get categories associated with standard unit

### Request

```http
GET /api/admin/standard-units/:standardUnitId/foods
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

## Get standard unit foods

Get foods associated with standard unit

### Request

```http
GET /api/admin/standard-units/:standardUnitId/foods
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
