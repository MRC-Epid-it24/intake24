# Survey respondents

## Browse respondents

Get list of survey respondents.

::: tip List content
List includes users with `{surveyId}/respondent` role.
:::

### Request

```http
GET /api/admin/surveys/:surveyId/respondents
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

## Create respondent

Create new survey respondent

### Request

```http
POST /api/admin/surveys/:surveyId/respondents

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "userName": string,
    "name": string? | null,
    "email": string? | null,
    "phone": string? | null,
    "password": string,
    "passwordConfirm": string,
    "customFields": {
        "name": string,
        "value": string
    }[]
}
```

### Response

```json
201 Created

{
    "data": {...},
}
```

## Update respondent

Update survey respondent

### Request

```http
PATCH /api/admin/surveys/:surveyId/respondents/:userId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "name": string? | null,
    "email": string? | null,
    "phone": string? | null,
    "password": string? | null,
    "passwordConfirm": string? | null
}
```

### Response

```json
200 OK

{
    "data": {...},
}
```

## Delete respondent

Delete respondent

### Request

```http
DELETE /api/admin/surveys/:surveyId/respondents/:userId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```

## Export authentication URLs

Submits a job to generate CSV file with authentication URLs.

### Request

```http
POST /api/admin/surveys/:surveyId/respondents/export-auth-urls

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

Returns job resource entry.

```json
200 OK

{
    "data": {...},
}
```

## Upload respondents

Submits a job to import respondent from CSV file.

### Request

```http
POST /api/admin/surveys/:surveyId/respondents/upload

Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

{
    "file": File
}
```

### Response

Returns job resource entry.

```json
200 OK

{
    "data": {...},
}
```
