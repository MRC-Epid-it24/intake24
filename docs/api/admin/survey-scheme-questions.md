# Survey scheme questions

Manage survey scheme question templates

## Browse survey scheme questions

Browse paginated survey scheme questions list

### Request

```http
GET /api/admin/survey-scheme-questions
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

## Create survey scheme question

Create new survey scheme question entry

### Request

```http
POST /api/admin/survey-scheme-questions

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "question": {...}
}
```

### Response

```json
201 Created

{
    ...
}
```

## Get survey scheme question

Get survey scheme question entry

### Request

```http
GET /api/admin/survey-scheme-questions/:surveySchemeQuestionId

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

## Update survey scheme question

Update survey scheme question entry

### Request

```http
PUT /api/admin/survey-scheme-questions/:surveySchemeQuestionId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "question": {...}
}
```

### Response

```json
200 OK

{
    ...
}
```

## Delete survey scheme question

Delete survey scheme question entry

### Request

```http
DELETE /api/admin/survey-scheme-questions/:surveySchemeQuestionId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```

## Survey scheme question references

Get survey scheme question references

### Request

```http
GET /api/admin/survey-scheme-questions/refs

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
    "questionIds": string[],
    "schemes": [{...}]
}
```

## Scheme question sync

Synchronize scheme question template with specific question in scheme section

### Request

```http
POST /api/admin/survey-scheme-questions/:surveySchemeQuestionId/sync

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "surveySchemeId": string,
    "section": string,
    "question": {...}
}
```

### Response

```json
200 OK

{
    "data": [{...}],
}
```
