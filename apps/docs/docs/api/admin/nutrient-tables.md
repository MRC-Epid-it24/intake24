# Nutrient tables

## Browse nutrient tables

Browse paginated nutrient tables list

### Request

```http
GET /api/admin/nutrient-tables
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

## Create nutrient table

Create new nutrient table entry

### Request

```http
POST /api/admin/nutrient-tables

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "id": string,
    "description": string,
    "csvMapping": {
        "idColumnOffset": number,
        "descriptionColumnOffset": number,
        "localDescriptionColumnOffset": number | null,
        "rowOffset": number
    },
    csvMappingFields: [{"fieldName": string, "columnOffset": number}],
    csvMappingNutrients: [{"nutrientTypeId": string, "columnOffset": number}]
}
```

### Response

```json
201 Created

{
    ...
}
```

## Get nutrient table

Get nutrient table entry

### Request

```http
GET /api/admin/nutrient-tables/:nutrientTableId

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

## Update nutrient table

Update nutrient table entry

### Request

```http
PUT /api/admin/nutrient-tables/:nutrientTableId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "id": string,
    "description": string,
    "csvMapping": {
        "idColumnOffset": number,
        "descriptionColumnOffset": number,
        "localDescriptionColumnOffset": number | null,
        "rowOffset": number
    },
    csvMappingFields: [{"fieldName": string, "columnOffset": number}],
    csvMappingNutrients: [{"nutrientTypeId": string, "columnOffset": number}]
}
```

### Response

```json
200 OK

{
    ...
}
```

## Delete nutrient table

Delete nutrient table entry

### Request

```http
DELETE /api/admin/nutrient-tables/:nutrientTableId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```

## Nutrient table references

Get nutrient table references

### Request

```http
GET /api/admin/nutrient-tables/refs

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "nutrients": [
        {
            "id": string,
            "unitId": string,
            "description": string
        },
        ...
    ]
}
```

## Upload nutrient data

Endpoint accepts two types of CSV files.

* NDB mapping
* NDB nutrient data

Upload is submitted as job and response returns `JobResponse` entry

### Request

```http
POST /api/admin/nutrient-tables/:nutrientTableId/upload

Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

{
    "type": 'NutrientTableImportData' | 'NutrientTableImportMapping',
    "file": File
}
```

### Response

```json
200 OK

{
    "data": {...}
}
```
