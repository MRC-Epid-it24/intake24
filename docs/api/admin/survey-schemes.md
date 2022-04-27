# Survey schemes

## Browse survey schemes

Browse paginated survey scheme list

### Request

```http
GET /api/admin/survey-schemes
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

## Create survey scheme

Create new survey scheme entry

### Request

```http
POST /api/admin/survey-schemes

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "name": string,
    "type": 'default',
    "meals": [{...}],
    "questions": {...},
    "dataExport": [{...}]
}
```

### Response

```json
201 Created

{
    ...
}
```

## Get survey scheme

Get survey scheme entry

### Request

```http
GET /api/admin/survey-schemes/:surveySchemeId

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

## Update survey scheme

Update survey scheme entry

### Request

```http
PATCH /api/admin/survey-schemes/:surveySchemeId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "name": string,
    "type": 'default',
    "meals": [{...}],
    "questions": {...},
    "dataExport": [{...}]
}
```

### Response

```json
200 OK

{
    ...
}
```

## Delete survey scheme

Delete survey scheme entry

### Request

```http
DELETE /api/admin/survey-schemes/:surveySchemeId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```

## Copy survey scheme

Create a new copy of specified source survey scheme

### Request

```http
POST /api/admin/survey-schemes/:surveySchemeId/copy

Authorization: Bearer {accessToken}
Content-Type: application/json

{
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

## Survey scheme references

Get survey scheme references

### Request

```http
GET /api/admin/survey-schemes/refs

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

## Data export references

Available fields for data export

### Request

```http
GET /api/admin/survey-schemes/:surveySchemeId/data-export

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
GET /api/admin/survey-schemes/:surveySchemeId/templates
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
