# Feedback schemes

## Browse feedback schemes

Browse paginated feedback scheme list

### Request

```http
GET /api/admin/feedback-schemes
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

## Create feedback scheme

Create new feedback scheme entry

### Request

```http
POST /api/admin/feedback-schemes

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "name": string,
    "type": 'default',
    "visibility": 'public' | 'restricted',
    "outputs": ['download', 'email', 'print'],
    "topFoods": {
        max: 2,
        colors: ['#FF6384', '#36A2EB', ...],
        nutrientTypes: [
            { id: '1', name: { en: 'Energy' } },
            ...
        ],
    },
    "cards": [{...}],
    "demographicGroups": [{...}],
    "henryCoefficients": [{...}],
}
```

### Response

```json
201 Created

{
    ...
}
```

## Get feedback scheme

Get feedback scheme entry

### Request

```http
GET /api/admin/feedback-schemes/:feedbackSchemeId

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

## Update feedback scheme

Update feedback scheme entry

### Request

```http
PATCH /api/admin/feedback-schemes/:feedbackSchemeId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "name": string,
    "type": 'default',
    "visibility": 'public' | 'restricted',
    "outputs": ['download', 'email', 'print'],
    "topFoods": {
        max: 2,
        colors: ['#FF6384', '#36A2EB', ...],
        nutrientTypes: [
            { id: '1', name: { en: 'Energy' } },
            ...
        ],
    },
    "cards": [{...}],
    "demographicGroups": [{...}],
    "henryCoefficients": [{...}],
}
```

### Response

```json
200 OK

{
    ...
}
```

## Delete feedback scheme

Delete feedback scheme entry

### Request

```http
DELETE /api/admin/feedback-schemes/:feedbackSchemeId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```

## Copy feedback scheme

Create a new copy of specified source feedback scheme

### Request

```http
POST /api/admin/feedback-schemes/:feedbackSchemeId/copy

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

## Feedback scheme references

Get feedback scheme references

### Request

```http
GET /api/admin/feedback-schemes/refs

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
