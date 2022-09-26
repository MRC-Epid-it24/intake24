# Nutrient types

## Browse nutrient types

Browse paginated nutrient type list

### Request

```json
GET /api/admin/nutrient-types
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

## Create nutrient type

Create new nutrient type entry

### Request

```json
POST /api/admin/nutrient-types

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "id": string,
    "description": string,
    "unitId": string,
    "kcalPerUnit": number | null
}
```

### Response

```json
201 Created

{
    ...
}
```

## Get nutrient type

Get nutrient type entry

### Request

```json
GET /api/admin/nutrient-types/:nutrientTypeId

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

## Update nutrient type

Update nutrient type entry

### Request

```json
PUT /api/admin/nutrient-types/:nutrientTypeId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "description": string,
    "unitId": string,
    "kcalPerUnit": number | null
}
```

### Response

```json
200 OK

{
    ...
}
```

## Delete nutrient type

Delete nutrient type entry

### Request

```json
DELETE /api/admin/nutrient-types/:nutrientTypeId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```

## nutrient type references

Get nutrient type references

### Request

```json
GET /api/admin/nutrient-types/refs

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "units": [
        {
            "id": string,
            "description": string
        },
        ...
    ],
}
```
