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

## Queue task

Submits job to the queue.

Specific jobs can be submitted to the queue. Each job type has its own parameters. See [job types](/admin/system/job-types) for more information.

### Request

```http
POST /api/admin/nutrient-tables/:nutrientTableId/tasks

Authorization: Bearer {accessToken}
Content-Type: application/json | multipart/form-data

{
    "type": string,
    "params": {
        ...
    }
}
```

### Response

Returns job resource entry.

```json
200 OK

{
    ...
}
```
