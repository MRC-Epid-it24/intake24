# Schemes

## Browse schemes

Browse paginated scheme list

### Request

```http
GET /api/admin/schemes
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

## Create scheme

Create new scheme entry

### Request

```http
POST /api/admin/schemes

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "id": string,
    "name": string,
    "type": 'data-driven',
    "meals": [{...}],
    "questions": {...},
    "export": [{...}]
}
```

### Response

```json
201 Created

{
    ...
}
```

## Get scheme

Get scheme entry

### Request

```http
GET /api/admin/schemes/:schemeId

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

## Update scheme

Update scheme entry

### Request

```http
PUT /api/admin/schemes/:schemeId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "name": string,
    "type": 'data-driven',
    "meals": [{...}],
    "questions": {...},
    "export": [{...}]
}
```

### Response

```json
200 OK

{
    ...
}
```

## Delete scheme

Delete scheme entry

### Request

```http
DELETE /api/admin/schemes/:schemeId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```

## Scheme references

Get scheme references

### Request

```http
GET /api/admin/schemes/refs

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "languages": [
        {
            "id": string,
            "englishName": string,
            "localName": string,
            "countryFlagCode": string
        },
        ...
    ],
    "templates": PromptQuestion[]
}
```

## Copy scheme

Create a new copy of specified source scheme

### Request

```http
POST /api/admin/schemes/copy

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "sourceId": string,
    "id": string,
    "name": string
}
```

### Response

```json
200 OK

{
    ...
}
```

## Data export references

Available fields for data export

### Request

```http
GET /api/admin/schemes/:schemeId/data-export

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "food": [
        {
            "id": string,
            "label": string
        },
        ...
    ],
    "foodCustom": [],
    "foodFields": [],
    "foodNutrients": [],
    "meal": [],
    "mealCustom": [],
    "portionSizes": [],
    "survey": [],
    "surveyCustom": [],
    "user": [],
    "userCustom": []
}
```

## Question templates

Browse available question templates for scheme

### Request

```http
GET /api/admin/schemes/:schemeId/templates
    ?search={searchText}
    &limit={limit}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

[
    {...}
]
```
