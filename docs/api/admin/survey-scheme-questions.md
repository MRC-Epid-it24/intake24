# Survey scheme questions

Manage survey scheme question templates

## Browse survey scheme questions

Browse paginated survey scheme questions list

### Request

```json
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

```json
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

```json
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

```json
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

```json
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

```json
GET /api/admin/survey-scheme-questions/refs

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "questionIds": string[],
    "schemes": [{...}]
}
```

## Scheme question sync

Synchronize scheme question template with specific question in scheme section

### Request

```json
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
