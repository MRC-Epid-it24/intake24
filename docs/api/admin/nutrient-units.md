# Nutrient units

## Browse nutrient units

Browse paginated nutrient nutrient list

### Request

```json
GET /api/admin/nutrient-units
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

## Create nutrient unit

Create new nutrient unit entry

### Request

```json
POST /api/admin/nutrient-units

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "id": string,
    "description": string,
    "symbol": string
}
```

### Response

```json
201 Created

{
    ...
}
```

## Get nutrient unit

Get nutrient unit entry

### Request

```json
GET /api/admin/nutrient-units/:nutrientUnitId

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

## Update nutrient unit

Update nutrient unit entry

### Request

```json
PUT /api/admin/nutrient-units/:nutrientUnitId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "description": string,
    "symbol": string
}
```

### Response

```json
200 OK

{
    ...
}
```

## Delete nutrient unit

Delete nutrient unit entry

### Request

```json
DELETE /api/admin/nutrient-units/:nutrientUnitId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```
