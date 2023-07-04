# Survey scheme prompts

Manage survey scheme prompt templates

## Browse survey scheme prompts

Browse paginated survey scheme prompts list

### Request

```json
GET /api/admin/survey-scheme-prompts
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

## Create survey scheme prompt

Create new survey scheme prompt entry

### Request

```json
POST /api/admin/survey-scheme-prompts

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "prompt": {...}
}
```

### Response

```json
201 Created

{
    ...
}
```

## Get survey scheme prompt

Get survey scheme prompt entry

### Request

```json
GET /api/admin/survey-scheme-prompts/:surveySchemePromptId

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

## Update survey scheme prompt

Update survey scheme prompt entry

### Request

```json
PUT /api/admin/survey-scheme-prompts/:surveySchemePromptId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "prompt": {...}
}
```

### Response

```json
200 OK

{
    ...
}
```

## Delete survey scheme prompt

Delete survey scheme prompt entry

### Request

```json
DELETE /api/admin/survey-scheme-prompts/:surveySchemePromptId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```

## Survey scheme prompt references

Get survey scheme prompt references

### Request

```json
GET /api/admin/survey-scheme-prompts/refs

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "promptIds": string[],
    "schemes": [{...}]
}
```

## Scheme prompt sync

Synchronize scheme prompt template with specific prompt in scheme section

### Request

```json
POST /api/admin/survey-scheme-prompts/:surveySchemePromptId/sync

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "surveySchemeId": string,
    "section": string,
    "prompt": {...}
}
```

### Response

```json
200 OK

{
    "data": [{...}],
}
```
